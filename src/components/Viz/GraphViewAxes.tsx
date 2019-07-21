import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { STUDY_MED, SALARY_MED } from '../FORCE';
import { STUDY, AUTOMATION_RISK, SALARY, WORKERS } from '../Controls/SortPanel';
import { WORKERS_MED } from '../../utils/constants';
import * as d3 from 'd3';

const getAxisTranslate = (d, axisLength, axisValue) => {
  switch (axisValue) {
    case AUTOMATION_RISK:
      return axisLength * d.automationRisk - axisLength;
    case STUDY:
      return (axisLength * d.yearsStudy) / STUDY_MED - axisLength;
    case SALARY:
      return (axisLength * d.salaryMed) / SALARY_MED - axisLength;
    case WORKERS:
      return (axisLength * d.workers) / WORKERS_MED - axisLength;
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
  return { x, y };
};

const reScaleAxes = ({ axisValues }) => {
  let graphViewPositions = {};
  const nodes = d3.selectAll('.node');
  nodes.each(
    (d: any) =>
      (graphViewPositions[d.id] = getGraphViewPositions({
        d,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        axisValues,
      }))
  );
  console.log('💡: reScaleAxes -> graphViewPositions', graphViewPositions);
  // TODO: change the flex-grow of ticks?
};

const AxisStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  &.hidden {
    opacity: 0;
  }
`;

export default ({ isGraphView, axisValues }) => {
  // update every second based on remaining nodes
  const timerRef = useRef(null as number | null);
  useEffect(() => {
    timerRef.current = window.setInterval(
      () => reScaleAxes({ axisValues }),
      1500
    );
    return () => {
      window.clearInterval(timerRef.current);
    };
  });

  const XAxis = () => (
    <div className='axis axisX'>
      {new Array(100).map((tick, idx) => (
        <div className='tick' />
      ))}
    </div>
  );

  const YAxis = () => (
    <div className='axis axisY'>
      {new Array(100).map((tick, idx) => (
        <div className='tick' />
      ))}
    </div>
  );

  return (
    <AxisStyles className={isGraphView ? 'hidden' : ''}>
      <XAxis />
      <YAxis />
    </AxisStyles>
  );
};
