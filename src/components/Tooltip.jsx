import { TooltipWithBounds } from '@vx/tooltip';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ControlsContext } from './Context/ContextProvider';

const getTooltipStyles = color => styled.div`
  width: 300px;
  font-family: 'Roboto light';
  border: 1px solid ${color};
  background: white;
  margin: 0;
  padding: 6pt 12pt;
  font-size: 12pt;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  line-height: 14pt;
  .title {
    margin: 0 0 8pt 0;
    line-height: 16pt;
  }
  .heading {
    font-weight: bold;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 3.2fr;
    grid-gap: 15px;
  }
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }
  .left {
    text-align: left;
  }
`;

const Tooltip = React.memo(function Tooltip({ data, left, top }) {
  const {
    state: { zScale, clusterSelector },
  } = useContext(ControlsContext);
  const color = zScale(data[clusterSelector]);
  // console.log(
  //   zScale,
  //   clusterSelector,
  //   color,
  //   data[clusterSelector],
  //   zScale(data[clusterSelector]),
  // );
  const TooltipStyles = getTooltipStyles(color);
  return (
    <TooltipWithBounds
      style={{ background: 'none', boxShadow: 'none' }}
      key={Math.random()}
      top={top}
      left={left}
    >
      <TooltipStyles>
        <h3 className="title center">{data.job}</h3>
        <div className="grid">
          <div className="heading right">Industry:</div>
          <div className="data left">{data.industry}</div>
          <div className="heading right">Salary:</div>
          <div className="data left">
            <strong>${data.salaryMed.toFixed(0)}K</strong> per year
          </div>
          <div className="heading right">Risk:</div>
          <div className="data left">
            <strong>{(data.automationRisk * 100).toFixed(0)}%</strong> chance of
            tasks being replaced by machine work
          </div>
        </div>
      </TooltipStyles>
    </TooltipWithBounds>
  );
});
export default Tooltip;
