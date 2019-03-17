import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import WarningIcon from '@material-ui/icons/WarningRounded';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { TOOLTIP_HZ_OFFSET, TOOLTIP_WIDTH } from '../../utils/constants';
import { ControlsContext } from '../Context/ContextProvider';

const getTooltipStyles = ({
  color,
  salaryMedPercent,
  automationRisk,
  educationPercent,
  left,
  top,
}) => styled.div`
  width: ${TOOLTIP_WIDTH}px;
  position: fixed;
  z-index: 999;
  top: ${top}px;
  left: ${left + TOOLTIP_WIDTH + TOOLTIP_HZ_OFFSET > window.innerWidth
    ? left - TOOLTIP_WIDTH - 2 * TOOLTIP_HZ_OFFSET
    : left + TOOLTIP_HZ_OFFSET}px;
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
    display: grid;
    grid-gap: 2px;
    place-items: center start;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 2.7fr;
    grid-gap: 15px;
  }
  .center {
    text-align: center;
  }
  .textAlignRight {
    text-align: right;
  }
  .textAlignLeft {
    text-align: left;
  }
  .iconTitle {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 4px;
    place-items: center start;
  }
  .bar {
    align-self: center;
    height: 10px;
    &.salaryBar {
      background: lime;
      width: ${salaryMedPercent * 100}%;
    }
    &.riskBar {
      background: tomato;
      width: ${automationRisk * 100}%;
    }
    &.educationBar {
      background: cornflowerblue;
      width: ${educationPercent * 100}%;
    }
  }
`;

const Tooltip = React.memo(({ data, left, top }) => {
  const {
    state: { zScale, clusterSelector },
  } = useContext(ControlsContext);
  const color = zScale(data[clusterSelector]);
  const { salaryMed, automationRisk, job, industry, yearsStudy } = data;
  // TODO: add arrow touching circle
  // TODO: follow circle instead of mouse (update position every .5s like recharts
  // TODO: swap out circle for job image on hover
  // console.log(
  //   zScale,
  //   clusterSelector,
  //   color,
  //   data[clusterSelector],
  //   zScale(data[clusterSelector]),
  // );
  // TODO: find reasonable salarymed?
  // TODO: add "10%, 100%" and "25k, 75k" annotation line to tooltip
  const salaryMedPercent = salaryMed / 75;
  // TODO: years of study (min, max?)
  const educationPercent = yearsStudy / 7;
  const TooltipStyles = getTooltipStyles({
    color,
    salaryMedPercent,
    automationRisk,
    educationPercent,
    left,
    top,
  });
  return (
    <TooltipStyles>
      <h3 className="title center">{job}</h3>
      <div className="grid">
        <div className="heading">Industry:</div>
        <div className="data textAlignLeft">{industry}</div>

        <div className="heading">
          <div className="iconTitle">
            <MoneyIcon />
            Salary:
          </div>
          <div className="bar salaryBar" />
        </div>
        <div className="data textAlignLeft">
          <strong>${salaryMed.toFixed(0)}K</strong> per year
        </div>

        <div className="heading">
          <div className="iconTitle">
            <SchoolIcon />
            Study:
          </div>
          <div className="bar educationBar" />
        </div>
        <div>
          <div className="data textAlignLeft">
            approx. <strong>{yearsStudy.toFixed(1)} years</strong>
          </div>
        </div>

        <div className="heading">
          <div className="iconTitle">
            <WarningIcon />
            Risk:
          </div>
          <div className="bar riskBar" />
        </div>
        <div className="data textAlignLeft">
          <strong>{(automationRisk * 100).toFixed(0)}%</strong> chance of tasks
          being replaced by machines
        </div>
      </div>
    </TooltipStyles>
  );
});
export default Tooltip;
