import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { STUDY_MAX, STUDY_MIN, SALARY_MAX, SALARY_MIN } from '../FORCE';
import {
  STUDY,
  AUTOMATION_RISK,
  AUTOMATION_RISK_LABEL,
  SALARY,
  WORKERS,
  SALARY_LABEL,
  WORKERS_LABEL,
  STUDY_LABEL,
} from '../Controls/SortPanel';
import {
  WORKERS_MIN,
  WORKERS_MAX,
  MOBILE_MIN_WIDTH,
} from '../../utils/constants';
import ContainerDimensions from 'react-container-dimensions';
import { ControlsContext } from '../Context/ContextProvider';
import { AXIS_HEIGHT } from './Viz';

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

export const getGraphViewPositions = ({ d, width, height, axisValues }) => {
  const x = getAxisTranslate(d, width, axisValues.x.displayName);
  const y = getAxisTranslate(d, height, axisValues.y.displayName);
  return { x: x - width / 2, y: y - height / 2 };
};

const AxisStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);
  &.hidden {
    opacity: 0;
  }
  .erd_scroll_detection_container {
    opacity: 0;
  }
  .axis {
    .tickAndLabelWrapper {
      transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);
      width: 0;
      position: relative;
      .label {
        position: absolute;
        font-family: system-ui;
      }
      .tick {
        background: rgba(0, 0, 0, 0.7);
        box-sizing: border-box;
      }
    }
  }

  .axisX {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    .tick {
      min-width: 1px;
      width: 1px;
      min-height: 6px;
    }
    .label {
      left: -1.2ch;
    }
  }
  .axisY {
    height: 100%;
    display: grid;
    align-content: center;
    .tick {
      width: 6px;
      min-height: 1px;
      height: 1px;
    }
    .label {
      top: -1.4ch;
      left: 8px;
    }
  }
`;

const reScaleAxes = ({ axisValues, nodes, setMargins, setLabels }) => {
  if (!nodes) {
    return null;
  }

  const boundingNodes = { right: null, left: null, top: null, bottom: null };
  // TODO: could get more accurate by doing top-bottom/2, right-left/2 (node centers)
  // get the node, distance, and labels for the most extreme nodes
  document.querySelectorAll('.node').forEach(node => {
    const { top, right, bottom, left } = node.getBoundingClientRect();
    // TODO: abstract
    if (!boundingNodes.top || boundingNodes.top.distance > top) {
      boundingNodes.top = {
        node,
        distance: top,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.right || boundingNodes.right.distance < right) {
      boundingNodes.right = {
        node,
        distance: right,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.bottom || boundingNodes.bottom.distance < bottom) {
      boundingNodes.bottom = {
        node,
        distance: bottom,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.left || boundingNodes.left.distance > left) {
      boundingNodes.left = {
        node,
        distance: left,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
  });

  const graphWidth = boundingNodes.right.distance - boundingNodes.left.distance;
  const graphHeight =
    boundingNodes.bottom.distance - boundingNodes.top.distance;

  const newMargins = {
    left: graphWidth / (NUM_TICKS - 1),
    top: graphHeight / (NUM_TICKS - 1),
  };

  const newLabels = {
    x: new Array(NUM_TICKS)
      .fill('')
      .map((d, idx) =>
        (
          (idx / NUM_TICKS) *
            (boundingNodes.right.axisLabels.x -
              boundingNodes.left.axisLabels.x) +
          boundingNodes.left.axisLabels.x
        ).toFixed(1),
      ),
    y: new Array(NUM_TICKS)
      .fill('')
      .map((d, idx) =>
        (
          (-idx / NUM_TICKS) *
            (boundingNodes.top.axisLabels.y -
              boundingNodes.bottom.axisLabels.y) +
          boundingNodes.top.axisLabels.y
        ).toFixed(1),
      ),
  };
  setMargins(newMargins);
  setLabels(newLabels);

  // TODO: set the tick labels
  // TODO: find min/max by axisValues on top/bottom/left/right
  // TODO: calculate & set tick labels
  // TODO: set tick margins based on positions of min/max nodes
};

const EMPTY_TICKS_ARRAY = new Array(NUM_TICKS).fill('');

const Axis = ({ labels, margins, isXAxis }) => (
  <div className={`axis axis${isXAxis ? 'X' : 'Y'}`}>
    {EMPTY_TICKS_ARRAY.map((tick, idx) => (
      // key = idx because ticks won't change?
      <div
        key={idx}
        className="tickAndLabelWrapper"
        style={{
          [isXAxis ? 'marginLeft' : 'marginTop']:
            idx === 0 ? 0 : margins[isXAxis ? 'left' : 'top'],
        }}
      >
        <div className="tick" />
        <div className="label">{labels[isXAxis ? 'x' : 'y'][idx]}</div>
      </div>
    ))}
  </div>
);

const GraphViewAxes = ({ axisValues }) => {
  const {
    state: { nodes },
  } = useContext(ControlsContext);

  const [margins, setMargins] = useState({ left: 0, top: 0 });
  const [labels, setLabels] = useState({
    x: EMPTY_TICKS_ARRAY,
    y: EMPTY_TICKS_ARRAY,
  });
  // update every second based on remaining nodes
  const timerRef = useRef(null as number | null);
  useEffect(() => {
    timerRef.current = window.setInterval(
      () => reScaleAxes({ axisValues, nodes, setMargins, setLabels }),
      1500,
    );
    return () => {
      window.clearInterval(timerRef.current);
    };
  });

  return (
    <>
      <Axis
        {...{
          labels,
          margins,
          isXAxis: true,
        }}
      />
      <Axis
        {...{
          labels,
          margins,
          isXAxis: false,
        }}
      />
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

const GraphViewAxisTitlesStyles = styled.div`
  position: absolute;
  display: grid;
  justify-items: center;
  width: 100%;
  height: 100%;
  font-family: system-ui;
  font-size: 1em;
  line-height: 1em;
  .axisTitle {
    white-space: nowrap;
    position: absolute;
    transition: all 1s ease-in-out;
    &.hidden,
    &.hidden .titleWrapper {
      opacity: 0;
      transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
  .axisTitleX {
    margin-right: ${-AXIS_HEIGHT / 2}px;
    &.hidden {
      transform: translateY(10px);
    }
  }
  .axisTitleY {
    height: 100%;
    width: 100%;
    text-align: center;
    display: grid;
    .titleWrapper {
      display: grid;
      align-items: center;
      justify-content: center;
      margin-top: ${AXIS_HEIGHT / 2}px;
      height: 100%;
      transform: rotate(-90deg);
      width: 1em;
    }
    &.hidden {
      transform: translateX(10px);
      .titleWrapper {
        transform: rotate(-90deg) translateY(10px);
      }
    }
  }
  @media (min-width: ${MOBILE_MIN_WIDTH}px) {
    line-height: 0;
    font-size: 1.5em;
    .titleWrapper {
      width: 1.5em;
    }
  }
`;
export const GraphViewAxisTitles = ({ isGraphView, axisValues }) => {
  const AXIS_TITLE_MAP = {
    [STUDY_LABEL]: 'Years of study',
    [AUTOMATION_RISK_LABEL]: 'Risk of machines replacing tasks (%)',
    [SALARY_LABEL]: 'Salary, median ($K per year)',
    [WORKERS_LABEL]: 'Workers in this job',
  };
  return (
    <GraphViewAxisTitlesStyles>
      <div className={`axisTitle axisTitleX${!isGraphView ? ' hidden' : ''}`}>
        {AXIS_TITLE_MAP[axisValues.x.dataLabel]}
      </div>
      <div className={`axisTitle axisTitleY${!isGraphView ? ' hidden' : ''}`}>
        <div className="titleWrapper">
          {AXIS_TITLE_MAP[axisValues.y.dataLabel]}
        </div>
      </div>
    </GraphViewAxisTitlesStyles>
  );
};
