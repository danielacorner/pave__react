import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import WarningIcon from '@material-ui/icons/WarningRounded';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';
import { TOOLTIP_HZ_OFFSET, TOOLTIP_WIDTH } from '../../utils/constants';
const TOOLTIP_TRANSITION = (type, time) =>
  `${type} ${time}s cubic-bezier(0.165, 0.84, 0.44, 1)`;

const TooltipStyles = styled.div`
  &.fadeOut {
    opacity: 0;
  }
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  width: ${TOOLTIP_WIDTH}px;
  position: fixed;
  z-index: 999;
  font-family: 'Roboto light';
  border: 1px solid black;
  background: white;
  margin: 0;
  padding: 6pt 12pt;
  font-size: 12pt;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  line-height: 14pt;
  overflow: hidden;
  .title {
    margin: 0 0 8pt 0;
    line-height: 1.2em;
    font-size: 1.4em;
  }
  .heading {
    font-weight: bold;
    display: grid;
    grid-gap: 2px;
    place-items: center start;
  }
  .subtitle {
    font-style: italic;
    grid-column: 1 / -1;
    font-size: 0.9em;
    .industry {
      margin-bottom: 3px;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      grid-gap: 5px;
      .industryColour {
        width: 12px;
        height: 12px;
        border: 1px solid black;
        border-radius: 100%;
        transition: ${TOOLTIP_TRANSITION('all', 0.6)};
      }
    }
  }
  .grid {
    display: grid;
    align-items: start;
    grid-template-columns: 1fr 2.7fr;
    grid-gap: 15px;
  }
  .data {
    margin-top: 3px;
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
    transition: ${TOOLTIP_TRANSITION('all', 0.6)};
    align-self: center;
    height: 10px;
    &.salaryBar {
      background: lime;
    }
    &.riskBar {
      background: tomato;
    }
    &.educationBar {
      background: cornflowerblue;
    }
    &:not(.emptyBar) {
      margin: -1px 0 0 -1px;
    }
    &.emptyBar {
      width: 75px;
      height: calc(100% - 1px);
      box-sizing: border-box;
      border: 1px solid black;
    }
  }
  .workers {
    width: 100%;
    position: relative;
  }
  .workersPointer {
    transition: ${TOOLTIP_TRANSITION('all', 0.4)};
    position: absolute;
    height: 1px;
    top: 1.25ch;
    background: rgba(0, 0, 0, 0.8);
  }
`;

const FloatingCircleStyles = styled.div`
  position: absolute;
  .floatingCircle {
    transition: ${TOOLTIP_TRANSITION('background', 0.4)};
    position: relative;
    border-radius: 100%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
    .floatingCircleMeasure {
      transition: none;
      /* transition: ${TOOLTIP_TRANSITION(0.4)}; */
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      left: -6px;
      width: 1px;
    }
    .floatingCircleTick {
      transition: none;
      /* transition: ${TOOLTIP_TRANSITION(0.4)}; */
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      width: 6px;
      height: 1px;
      left: -6px;
      &.top {
        top: 0;
      }
    }
  }
`;
const FloatingCircle = ({ width, background, right, bottom }) => {
  return (
    <FloatingCircleStyles style={{ right, bottom }}>
      <div
        className="floatingCircle"
        style={{ width, height: width, background }}
      >
        <div className="floatingCircleMeasure" style={{ height: width }} />
        <div className="floatingCircleTick top" />
        <div className="floatingCircleTick bottom" style={{ top: width }} />
      </div>
    </FloatingCircleStyles>
  );
};

const Tooltip = ({ data, left, bottom, width }) => {
  const {
    salaryMed,
    automationRisk,
    job,
    industry,
    yearsStudy,
    workers,
  } = data;
  // TODO: add arrow touching circle
  // TODO: swap out circle for job image on hover
  // TODO: find reasonable salarymed?
  const salaryMedPercent = salaryMed / 75;
  // TODO: years of study (min, max?)
  const educationPercent = yearsStudy / 7;
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const { state } = useContext(ControlsContext);
  const { zScale } = state;
  const getLeft = () =>
    left + TOOLTIP_WIDTH + TOOLTIP_HZ_OFFSET > window.innerWidth
      ? left - TOOLTIP_WIDTH - 2 * TOOLTIP_HZ_OFFSET
      : left + TOOLTIP_HZ_OFFSET;

  const floatingCircleProps = {
    width,
    background: zScale(industry),
    right: -width / 2,
    bottom: 175 - width / 2,
  };
  return (
    <TooltipStyles
      className="mouseoverTooltip"
      style={{
        // TODO: top seems to increase with window width BUT WHY
        bottom,
        left: getLeft(),
      }}
    >
      <FloatingCircle {...floatingCircleProps} />
      <h3 className="title textAlignLeft">{job}</h3>
      <div className="grid">
        <div className="data subtitle textAlignLeft">
          <div className="industry textAlignLeft">
            <div
              className="industryColour"
              style={{ background: zScale(industry) }}
            />
            {industry}
          </div>
          <div className="workers textAlignLeft">
            {numberWithCommas(workers.toFixed(0))} workers
            <div
              className="workersPointer"
              style={{
                right: width / 2 - 10,
                left: `${`${numberWithCommas(workers.toFixed(0))} workers`
                  .length - 1}ch`,
              }}
            />
          </div>
        </div>

        <div className="heading">
          <div className="iconTitle">
            <MoneyIcon />
            Salary:
          </div>
          <div className="bar emptyBar">
            <div
              className="bar salaryBar"
              style={{ width: `${salaryMedPercent * 100}%` }}
            />
          </div>
        </div>
        <div className="data textAlignLeft">
          <strong>${salaryMed.toFixed(0)}K</strong> per year
        </div>

        <div className="heading">
          <div className="iconTitle">
            <SchoolIcon />
            Study:
          </div>
          <div className="bar emptyBar">
            <div
              className="bar educationBar"
              style={{ width: `${educationPercent * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="data textAlignLeft">
            ~ <strong>{yearsStudy.toFixed(1)} years</strong>
          </div>
        </div>

        <div className="heading">
          <div className="iconTitle">
            <WarningIcon />
            Risk:
          </div>
          <div className="bar emptyBar">
            <div
              className="bar riskBar"
              style={{ width: `${automationRisk * 100}%` }}
            />
          </div>
        </div>
        <div className="data textAlignLeft">
          <strong>{(automationRisk * 100).toFixed(0)}%</strong> chance of tasks
          being replaced by machines
        </div>
      </div>
    </TooltipStyles>
  );
};
export default Tooltip;
