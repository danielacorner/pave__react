import React from 'react';
import styled from 'styled-components';
import { STUDY_MED, SALARY_MED } from '../FORCE';
import { STUDY, AUTOMATION_RISK, SALARY, WORKERS } from '../Controls/SortPanel';
import { WORKERS_MED } from '../../utils/constants';

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

export default ({ isGraphView }) => {
  const XAxis = () => <div className="axis axisX" />;

  const YAxis = () => <div className="axis axisY" />;

  return (
    <AxisStyles className={isGraphView ? 'hidden' : ''}>
      <XAxis />
      <YAxis />
    </AxisStyles>
  );
};
