import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { STUDY_MAX, STUDY_MIN, SALARY_MAX, SALARY_MIN } from '../FORCE';
import {
  STUDY,
  AUTOMATION_RISK,
  SALARY,
  WORKERS,
  SALARY_LABEL,
  WORKERS_LABEL,
  STUDY_LABEL,
} from '../Controls/SortPanel';
import { WORKERS_MIN, WORKERS_MAX } from '../../utils/constants';
import ContainerDimensions from 'react-container-dimensions';
import { ControlsContext } from '../Context/ContextProvider';

const NUM_TICKS = 6;

const getAxisTranslate = (d, axisLength, axisValue) => {
  switch (axisValue) {
    case AUTOMATION_RISK:
      return axisLength * d.automationRisk;
    case STUDY:
      return (
        (axisLength * (d[STUDY_LABEL] - STUDY_MIN)) / (STUDY_MAX - STUDY_MIN)
      );
    case SALARY:
      return (
        (axisLength * (d[SALARY_LABEL] - SALARY_MIN)) /
        (SALARY_MAX - SALARY_MIN)
      );
    case WORKERS:
      return (
        (axisLength * (d[WORKERS_LABEL] - WORKERS_MIN)) /
        (WORKERS_MAX - WORKERS_MIN)
      );
    default:
      break;
  }
};

export const getGraphViewPositions = ({
  d,
  innerWidth,
  innerHeight,
  axisValues,
}) => {
  const x = getAxisTranslate(d, innerWidth, axisValues.x.displayName);
  const y = getAxisTranslate(d, innerHeight, axisValues.y.displayName);
  return { x: x * 2 - innerWidth, y: y * 2 - innerHeight * 1.1 };
};

const AxisStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  /* &.hidden {
    opacity: 0;
  } */
  .erd_scroll_detection_container {
    opacity: 0;
  }
  .axis .tick {
    background: rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
  }
  .axisX {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    .tick {
      min-width: 1px;
      min-height: 6px;
    }
  }
  .axisY {
    height: 100%;
    display: grid;
    align-content: center;
    .tick {
      width: 6px;
      min-height: 1px;
    }
  }
`;

const reScaleAxes = ({ axisValues, nodes, setMargins }) => {
  if (!nodes) {
    return null;
  }

  // TODO: do we need these?
  // const graphViewPositions = {};
  // gives x/y values
  // const boundaries = {
  //   min: { x: Infinity, y: Infinity },
  //   max: { x: -Infinity, y: -Infinity },
  // };

  const boundingNodes = { right: null, left: null, top: null, bottom: null };
  // TODO: could get more accurate by doing top-bottom/2, right-left/2 (node centers)
  document.querySelectorAll('.node').forEach(node => {
    // const nodePositionInGraphView = getGraphViewPositions({
    //   d: node,
    //   innerWidth: window.innerWidth,
    //   innerHeight: window.innerHeight,
    //   axisValues,
    // });
    // graphViewPositions[node.id] = nodePositionInGraphView;
    // boundaries.min = {
    //   x: Math.min(boundaries.min.x, nodePositionInGraphView.x),
    //   y: Math.min(boundaries.min.y, nodePositionInGraphView.y),
    // };
    // boundaries.max = {
    //   x: Math.max(boundaries.max.x, nodePositionInGraphView.x),
    //   y: Math.max(boundaries.max.y, nodePositionInGraphView.y),
    // };

    const { top, right, bottom, left } = node.getBoundingClientRect();
    // TODO: abstract
    if (!boundingNodes.top || boundingNodes.top.distance > top) {
      boundingNodes.top = {
        node,
        distance: top,
        axisLabels: {
          x: nodes[node.id.slice(5)][axisValues.x.dataLabel],
          y: nodes[node.id.slice(5)][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.right || boundingNodes.right.distance < right) {
      boundingNodes.right = {
        node,
        distance: right,
        axisLabels: {
          x: nodes[node.id.slice(5)][axisValues.x.dataLabel],
          y: nodes[node.id.slice(5)][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.bottom || boundingNodes.bottom.distance < bottom) {
      boundingNodes.bottom = {
        node,
        distance: bottom,
        axisLabels: {
          x: nodes[node.id.slice(5)][axisValues.x.dataLabel],
          y: nodes[node.id.slice(5)][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.left || boundingNodes.left.distance > left) {
      boundingNodes.left = {
        node,
        distance: left,
        axisLabels: {
          x: nodes[node.id.slice(5)][axisValues.x.dataLabel],
          y: nodes[node.id.slice(5)][axisValues.y.dataLabel],
        },
      };
    }
  });
  console.log('TCL: reScaleAxes -> axisValues', axisValues);
  console.log('TCL: reScaleAxes -> boundingNodes', boundingNodes);

  const graphWidth = boundingNodes.right.distance - boundingNodes.left.distance;
  const graphHeight =
    boundingNodes.bottom.distance - boundingNodes.top.distance;

  const newMargins = {
    left: graphWidth / (NUM_TICKS - 1),
    top: graphHeight / (NUM_TICKS - 1),
  };
  setMargins(newMargins);

  // TODO: set the tick labels
  // TODO: find min/max by axisValues on top/bottom/left/right
  // TODO: calculate & set tick labels
  // TODO: set tick margins based on positions of min/max nodes
};

const GraphViewAxes = ({ axisValues, width, height }) => {
  const {
    state: { nodes },
  } = useContext(ControlsContext);

  // update every second based on remaining nodes
  const timerRef = useRef(null as number | null);
  useEffect(() => {
    timerRef.current = window.setInterval(
      () => reScaleAxes({ axisValues, nodes, setMargins }),
      1500,
    );
    return () => {
      window.clearInterval(timerRef.current);
    };
  });
  const [margins, setMargins] = useState({ left: 0, top: 0 });

  const XAxis = () => (
    <div className="axis axisX">
      {new Array(NUM_TICKS).fill('').map((tick, idx) => (
        // key = idx because all ticks are identical?
        <div
          key={idx}
          className="tick"
          style={{ marginLeft: idx === 0 ? 0 : margins.left }}
        />
      ))}
    </div>
  );

  const YAxis = () => (
    <div className="axis axisY">
      {new Array(NUM_TICKS).fill('').map((tick, idx) => (
        <div
          key={idx}
          className="tick"
          style={{ marginTop: idx === 0 ? 0 : margins.top }}
        />
      ))}
    </div>
  );

  return (
    <>
      <XAxis />
      <YAxis />
    </>
  );
};

export default props => (
  <AxisStyles className={!props.isGraphView ? 'hidden' : ''}>
    <ContainerDimensions>
      {({ width, height }) => (
        <GraphViewAxes {...{ width, height, ...props }} />
      )}
    </ContainerDimensions>
  </AxisStyles>
);
