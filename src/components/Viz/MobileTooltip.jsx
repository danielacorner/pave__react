import Drawer from '@material-ui/core/Drawer';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { TABLET_MIN_WIDTH } from '../../utils/constants';
import {
  numberWithCommas,
  FloatingCircle,
  TOOLTIP_TRANSITION,
} from './Tooltip';
import { getCircleColour, lightGrey } from '../FORCE';
import { INDUSTRY } from '../Controls/SortPanel';

export const ICON_WIDTH = 32;
export const ICON_SCALE = 1.5;
export const ICON_DY = -2;

export const MAX_TOOLTIP_LINES = 3;
const MobileTooltipStyles = styled.div`
  .giveMeEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${MAX_TOOLTIP_LINES}; /* number of lines to show */
    line-height: 1.2em; /* fallback */
    max-height: 1.2 * ${MAX_TOOLTIP_LINES}em; /* fallback */
  }
  overflow-x: hidden;
  position: relative;
  .btnMoreInfoWrapper {
    width: 100%;
    display: grid;
    justify-items: end;
    @media (min-width: ${TABLET_MIN_WIDTH}px) {
    }
  }
  .btnMoreInfo {
    padding: 5px 12px;
    text-transform: none;
    span:first-child {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-gap: 8px;
    }

    @media (min-width: ${TABLET_MIN_WIDTH}px) {
      position: absolute;
      bottom: 24px;
      right: 24px;
    }
  }
  font-family: 'Roboto light';
  margin: 0;
  padding: 10pt 18pt 18pt 18pt;
  font-size: 12pt;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  line-height: 14pt;
  .title {
    transition: all 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
    font-size: 1.8em;
    margin: 0 0 6pt 0;
    line-height: 1.2em;
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
    grid-template-columns: 72px 1fr;
    grid-gap: 15px 30px;
    margin-bottom: 18px;
    @media (min-width: ${TABLET_MIN_WIDTH}px) {
      margin-bottom: 0;
    }
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
    font-size: 0.8em;
    margin-top: 3px;
  }
  .iconTitle {
    font-weight: bold;
  }
  .bar {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    height: ${ICON_WIDTH * 1}px;
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
  .salary {
    margin-left: -1ch;
  }
  .study {
    margin-left: -1.5ch;
  }
  .extraText {
    position: absolute;
    left: calc(5px + 1ch);
    &.extraText1 {
      bottom: -14px;
    }
    &.extraText2 {
      bottom: -28px;
    }
  }
`;

const MobileTooltipContents = ({ data, width = 0 }) => {
  const {
    job,
    industry,
    salaryMed,
    automationRisk,
    yearsStudy,
    workers,
  } = data;
  const circleColour = getCircleColour({ d: data, colouredByValue: INDUSTRY });

  // TODO: find reasonable salarymed?
  // TODO: add "10%, 100%" and "25k, 75k" annotation line to tooltip
  const salaryMedPercent = salaryMed / 75;
  // TODO: years of study (min, max?)
  const educationPercent = yearsStudy / 7;
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
    bottom: 221 - width / 2,
  };

  const roundToHundreds = x => 100 * Math.round(x / 100);
  const workersDisplay = `${numberWithCommas(
    roundToHundreds(workers.toFixed(0)),
  )} workers`;

  return (
    <MobileTooltipStyles>
      <FloatingCircle {...floatingCircleProps} />

      <h3
        className="title textAlignLeft giveMeEllipsis"
        style={{
          maxHeight,
          minHeight,
        }}
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
                right: width / 2 - 19,
                left: `${workersDisplay.length - 1}ch`,
              }}
            />
          </div>
        </div>

        <div className="heading">
          <div className="iconTitle">Salary:</div>
          <div className="data textAlignLeft salary">
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
          <div className="data textAlignLeft study">
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
          <div className="data textAlignLeft automation">
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
          of tasks being
        </div>
        <div className="data textAlignLeft extraText extraText2">
          replaced by machines
        </div>
      </div>
    </MobileTooltipStyles>
  );
};

const MobileTooltip = ({ data, width }) => {
  // preserve data so mobile tooltip can close smoothly
  const [prevData, setPrevData] = useState(null);
  const [open, setOpen] = useState(false);
  if (data && data !== prevData) {
    setPrevData(data);
  }
  if (data && !open) {
    setOpen(true);
  } else if (!data && open) {
    setTimeout(() => setOpen(false));
  }

  return (
    <Drawer anchor={'top'} open={open} transitionDuration={200}>
      <div tabIndex={0} role="button">
        <MobileTooltipContents data={data ? data : prevData} width={width} />
      </div>
    </Drawer>
  );
};
export default MobileTooltip;
