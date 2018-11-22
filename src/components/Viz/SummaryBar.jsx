import React from 'react';

const SummaryBar = props => (
  <g id="summaryBar">
    <rect
      height={props.height}
      width={props.width}
      fill={props.fill}
      x={props.x}
      y={props.y}
      rx="4" // border radius
    />
    {/* value on top of var */}
    <text fill={props.valueColor} x={props.x} y={props.y - 5}>
      {/* value rounded to 1 decimal */}
      {props.value.toFixed(props.decimals)}
    </text>
    {/* label overlaid on bar */}
    <text
      fill={props.labelColor}
      x={props.x + 5}
      y={props.y - 5}
      transform={`rotate(90 ${props.x} ${props.y})`}
    >
      {props.label}
    </text>
  </g>
);

export default SummaryBar;
