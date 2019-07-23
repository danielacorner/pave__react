import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { STUDY_MAX, STUDY_MIN, SALARY_MAX, SALARY_MIN } from '../FORCE';
import { STUDY, AUTOMATION_RISK, SALARY, WORKERS } from '../Controls/SortPanel';
import { WORKERS_MIN, WORKERS_MAX } from '../../utils/constants';
import * as d3 from 'd3';
import ContainerDimensions from 'react-container-dimensions';

const NUM_TICKS = 6;

const getAxisTranslate = (d, axisLength, axisValue) => {
  switch (axisValue) {
    case AUTOMATION_RISK:
      return axisLength * d.automationRisk;
    case STUDY:
      return (
        (axisLength * (d.yearsStudy - STUDY_MIN)) / (STUDY_MAX - STUDY_MIN)
      );
    case SALARY:
      return (
        (axisLength * (d.salaryMed - SALARY_MIN)) / (SALARY_MAX - SALARY_MIN)
      );
    case WORKERS:
      return (
        (axisLength * (d.workers - WORKERS_MIN)) / (WORKERS_MAX - WORKERS_MIN)
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
  const x = getAxisTranslate(d, innerWidth, axisValues.x);
  const y = getAxisTranslate(d, innerHeight, axisValues.y);
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
    display: flex;
    .tick {
      min-width: 1px;
      min-height: 6px;
    }
  }
  .axisY {
    display: flex;
    flex-direction: column;
    .tick {
      width: 6px;
      min-height: 1px;
    }
  }
`;

const GraphViewAxes = ({ axisValues, width, height }) => {
  // update every second based on remaining nodes
  const timerRef = useRef(null as number | null);
  const [margins, setMargins] = useState({ left: 0, top: 0 });

  const reScaleAxes = ({ axisValues }) => {
    let graphViewPositions = {};
    let bounds = {
      min: { x: Infinity, y: Infinity },
      max: { x: -Infinity, y: -Infinity },
    };
    const nodes = d3.selectAll('.node');
    nodes.each((node: any) => {
      const nodePositions = getGraphViewPositions({
        d: node,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        axisValues,
      });
      graphViewPositions[node.id] = nodePositions;
      bounds = {
        min: {
          x: Math.min(bounds.min.x, nodePositions.x),
          y: Math.min(bounds.min.y, nodePositions.y),
        },
        max: {
          x: Math.max(bounds.max.x, nodePositions.x),
          y: Math.max(bounds.max.y, nodePositions.y),
        },
      };
    });
    console.log('💡: reScaleAxes -> graphViewPositions', graphViewPositions);
    console.log('💡: reScaleAxes -> bounds', bounds);

    const newMargins = {
      left: width / NUM_TICKS,
      top: height / NUM_TICKS,
    };
    setMargins(newMargins);
    // TODO: change the margin of ticks?
  };

  useEffect(() => {
    timerRef.current = window.setInterval(
      () => reScaleAxes({ axisValues }),
      1500,
    );
    return () => {
      window.clearInterval(timerRef.current);
    };
  });

  const XAxis = () => (
    <div className="axis axisX">
      {new Array(NUM_TICKS).fill('').map((tick, idx) => (
        // key = idx because all ticks are identical?
        <div key={idx} className="tick" style={{ marginLeft: margins.left }} />
      ))}
    </div>
  );

  const YAxis = () => (
    <div className="axis axisY">
      {new Array(NUM_TICKS).fill('').map((tick, idx) => (
        <div key={idx} className="tick" style={{ marginTop: margins.top }} />
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
