import React from 'react';
import styled from 'styled-components/macro';
import { TOOLTIP_HZ_OFFSET, TOOLTIP_WIDTH } from '../../utils/constants';
import { getCircleColour, lightGrey } from '../FORCE';
import { INDUSTRY } from '../Controls/SortPanel';
import { MAX_TOOLTIP_LINES } from './MobileTooltip';
export const TOOLTIP_TRANSITION = (type, time) =>
  `${type} ${time}s cubic-bezier(0.165, 0.84, 0.44, 1)`;

const TooltipStyles = styled.div`
  .giveMeEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${MAX_TOOLTIP_LINES}; /* number of lines to show */
    line-height: 1.2em; /* fallback */
    max-height: 1.2 * ${MAX_TOOLTIP_LINES}em; /* fallback */
  }
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
  padding: 6pt 12pt 24pt 12pt;
  font-size: 12pt;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  line-height: 14pt;
  overflow: hidden;
  .title {
    transition: all 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
    margin: 0 0 8pt 0;
    line-height: 1.2em;
    font-size: 1.4em;
  }
  .heading {
    font-weight: bold;
    display: grid;
    grid-gap: 2px;
    place-items: center flex-end;
  }
  .grid {
    position: relative;
    display: grid;
    align-items: start;
    grid-template-columns: 1fr ${5 * 32}px;
    grid-gap: 15px 12px;
  }
  .subtitle {
    font-style: italic;
    grid-column: 1 / -1;
    font-size: 0.9em;
    .industry {
      font-style: italic;
      grid-column: 1 / -1;
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
  .data {
    margin-top: 3px;
    font-size: 0.8em;
  }
  .iconTitle {
    justify-self: start;
    font-weight: bold;
  }
  .bar {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    /* TODO: import ICON_WIDTH not working? */
    height: ${32}px;
    align-self: center;
    &.salaryBar {
      background: lime;
      clip-path: url(#moneyClip);
    }
    &.riskBar {
      background: tomato;
      clip-path: url(#riskClip);
    }
    &.educationBar {
      background: cornflowerblue;
      clip-path: url(#studyClip);
    }
  }
  .extraText {
    position: absolute;
    left: calc(5px + 5ch);
    &.extraText1 {
      bottom: -14px;
    }
  }
`;

export const FloatingCircleStyles = styled.div`
  position: absolute;
  .floatingCircle {
    opacity:0.4;
    transition: ${TOOLTIP_TRANSITION('all', 0.2)};
    position: relative;
    border-radius: 100%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
    .floatingCircleMeasure {
      transition: none;
      /* transition: ${TOOLTIP_TRANSITION(0.4)}; */
      position: absolute;
      background: black;
      left: -6px;
      width: 1px;
    }
    .floatingCircleTick {
      transition: none;
      /* transition: ${TOOLTIP_TRANSITION(0.4)}; */
      position: absolute;
      background: black;
      width: 6px;
      height: 1px;
      left: -6px;
      &.top {
        top: 0;
      }
    }
  }
`;
export const FloatingCircle = ({ width, background, right, bottom }) => {
  return (
    <FloatingCircleStyles style={{ right: right || 0, bottom: bottom || 300 }}>
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

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  const circleColour = getCircleColour({ d: data, colouredByValue: INDUSTRY });

  const getLeft = () =>
    left + TOOLTIP_WIDTH + TOOLTIP_HZ_OFFSET > window.innerWidth
      ? left - TOOLTIP_WIDTH - 2 * TOOLTIP_HZ_OFFSET
      : left + TOOLTIP_HZ_OFFSET;

  const AVG_CHAR_PER_ROW = 25;
  const LINE_HEIGHT_EMS = 1.2;
  const maxHeight =
    (job.length > AVG_CHAR_PER_ROW - 4
      ? LINE_HEIGHT_EMS * Math.ceil(job.length / (AVG_CHAR_PER_ROW - 4))
      : LINE_HEIGHT_EMS) + 'em';
  const minHeight =
    (job.length > AVG_CHAR_PER_ROW + 4
      ? LINE_HEIGHT_EMS * Math.ceil(job.length / (AVG_CHAR_PER_ROW + 4))
      : LINE_HEIGHT_EMS) + 'em';

  const floatingCircleProps = {
    width,
    background: lightGrey,
    right: -width / 2,
    bottom: 210 - width / 2,
  };

  const roundToHundreds = x => 100 * Math.round(x / 100);
  const workersDisplay = `${numberWithCommas(
    roundToHundreds(workers.toFixed(0)),
  )} workers`;

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
      <h3
        style={{
          maxHeight,
          minHeight,
        }}
        className="title textAlignLeft giveMeEllipsis"
      >
        {job}
      </h3>

      <div className="grid">
        <div className="data subtitle textAlignLeft">
          <div className="industry textAlignLeft">
            <div
              className="industryColour"
              style={{ background: circleColour }}
            />
            {industry}
          </div>
          <div className="workers textAlignLeft">
            {workersDisplay}
            <div
              className="workersPointer"
              style={{
                right: width / 2 - 10,
                left: `${workersDisplay.length - 1}ch`,
              }}
            />
          </div>
        </div>

        <div className="heading">
          <div className="iconTitle">Salary:</div>
          <div className="data textAlignRight salary">
            <strong>${salaryMed.toFixed(0)}K</strong> per year
          </div>
        </div>

        <div
          className="bar salaryBar"
          style={{
            width: salaryMedPercent * 100 + '%',
          }}
        />

        <div className="heading">
          <div className="iconTitle">Study:</div>
          <div className="data textAlignRight study">
            ~ <strong>{yearsStudy.toFixed(1)} years</strong>
          </div>
        </div>

        <div
          className="bar educationBar"
          style={{
            width: educationPercent * 100 + '%',
          }}
        />

        <div className="heading">
          <div className="iconTitle">Risk:</div>
          <div className="data textAlignRight automation">
            <strong>{(automationRisk * 100).toFixed(0)}%</strong> chance
          </div>
        </div>

        <div
          className="bar riskBar"
          style={{
            width: automationRisk * 100 + '%',
          }}
        />
        <div className="data textAlignLeft extraText extraText1">
          of tasks being replaced by machines
        </div>
      </div>
    </TooltipStyles>
  );
};
export default Tooltip;
