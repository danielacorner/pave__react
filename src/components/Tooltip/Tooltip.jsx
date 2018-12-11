import React from 'react';

export default ({ tooltip }) => (
  <div
    key={Math.random()}
    style={{
      minWidth: 60,
      maxWidth: 200,
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      fontFamily: 'Verdana',
      position: 'fixed',
      left: tooltip.left,
      top: tooltip.top,
      margin: 0,
    }}
  >
    <div
      style={{
        fontFamily: 'Roboto light',
        color: tooltip.zScale(tooltip.data[tooltip.clusterSelector]),
      }}
    >
      <h3>{tooltip.data.job}</h3>
    </div>
    <div>
      <p style={{ textAlign: 'left' }}>
        <small>Industry:</small>
      </p>
      <p style={{ textAlign: 'right' }}>{tooltip.data.industry}</p>
      <p style={{ textAlign: 'left' }}>
        <small>Salary (median):</small>
      </p>
      <p style={{ textAlign: 'right' }}>${tooltip.data.salaryMed} per year</p>
      <p style={{ textAlign: 'left' }}>
        <small>Risk of machine automation: </small>
      </p>
      <p style={{ textAlign: 'right' }}>
        {(tooltip.data.automationRisk * 100).toFixed(2)}%
      </p>
    </div>
  </div>
);
