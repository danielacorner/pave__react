import React from 'react';
import styled from 'styled-components';

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
