import { TooltipWithBounds } from '@vx/tooltip';
import React from 'react';

export default ({ tooltip: { clusterSelector, zScale, data, left, top } }) => (
  <TooltipWithBounds
    key={Math.random()}
    left={left}
    top={top}
    style={{
      minWidth: 60,
      maxWidth: 200,
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      fontFamily: 'Verdana',
      position: 'fixed',
      margin: 0,
    }}
  >
    <div
      style={{
        fontFamily: 'Roboto light',
        color: zScale(data[clusterSelector]),
      }}
    >
      <h3>{data.job}</h3>
    </div>
    <div>
      <p style={{ textAlign: 'left' }}>
        <small>Industry:</small>
      </p>
      <p style={{ textAlign: 'right' }}>{data.industry}</p>
      <p style={{ textAlign: 'left' }}>
        <small>Salary (median):</small>
      </p>
      <p style={{ textAlign: 'right' }}>${data.salaryMed} per year</p>
      <p style={{ textAlign: 'left' }}>
        <small>Risk of machine automation: </small>
      </p>
      <p style={{ textAlign: 'right' }}>
        {(data.automationRisk * 100).toFixed(2)}%
      </p>
    </div>
  </TooltipWithBounds>
);
