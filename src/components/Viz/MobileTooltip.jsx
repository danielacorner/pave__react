import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TABLET_MIN_WIDTH } from '../../utils/constants';

const ICON_WIDTH = 32;
const ICON_SCALE = 1.5;
const ICON_DY = -2;

const MobileTooltipStyles = styled.div`
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
    transition: max-height 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
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
  .industry {
    font-style: italic;
    grid-column: 1 / -1;
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
  .data {
    font-size: 0.8em;
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

const MobileTooltipContents = ({ data }) => {
  const { job, industry, salaryMed, color, automationRisk, yearsStudy } = data;
  // TODO: find reasonable salarymed?
  // TODO: add "10%, 100%" and "25k, 75k" annotation line to tooltip
  const salaryMedPercent = salaryMed / 75;
  // TODO: years of study (min, max?)
  const educationPercent = yearsStudy / 7;
  const AVG_CHAR_PER_ROW = 21;
  const LINE_HEIGHT_EMS = 1.2;
  return (
    <MobileTooltipStyles>
      <h3
        className="title textAlignLeft"
        style={{
          maxHeight:
            (job.length > AVG_CHAR_PER_ROW
              ? LINE_HEIGHT_EMS * Math.ceil(job.length / AVG_CHAR_PER_ROW)
              : LINE_HEIGHT_EMS) + 'em',
        }}
      >
        {job}
      </h3>

      <div className="grid">
        <div className="data industry textAlignLeft">{industry}</div>

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
      <div className="btnMoreInfoWrapper">
        <Button variant="outlined" className="btnMoreInfo" disabled={true}>
          Learn More <OpenInNewIcon />
        </Button>
      </div>
    </MobileTooltipStyles>
  );
};

const MobileTooltip = ({ data }) => {
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
        <MobileTooltipContents data={data ? data : prevData} />
      </div>
    </Drawer>
  );
};

export const PictogramClipPathsDefs = () => (
  <svg width="0" height="0">
    <defs>
      <clipPath id="moneyClip">
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              0}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              0}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12.31 11.14c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              1}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              1}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12.31 11.14c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              2}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              2}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12.31 11.14c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              3}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              3}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12.31 11.14c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              4}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              4}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M12.31 11.14c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"
        />
      </clipPath>
      <clipPath id="riskClip">
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              0}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              1}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              2}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              3}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              4}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"
        />
      </clipPath>
      <clipPath id="studyClip">
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              0}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66l-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0L21 10.09V16c0 .55.45 1 1 1s1-.45 1-1V9.59c0-.37-.2-.7-.52-.88l-9.52-5.19a2.04 2.04 0 0 0-1.92 0z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              1}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66l-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0L21 10.09V16c0 .55.45 1 1 1s1-.45 1-1V9.59c0-.37-.2-.7-.52-.88l-9.52-5.19a2.04 2.04 0 0 0-1.92 0z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              2}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66l-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0L21 10.09V16c0 .55.45 1 1 1s1-.45 1-1V9.59c0-.37-.2-.7-.52-.88l-9.52-5.19a2.04 2.04 0 0 0-1.92 0z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              3}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66l-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0L21 10.09V16c0 .55.45 1 1 1s1-.45 1-1V9.59c0-.37-.2-.7-.52-.88l-9.52-5.19a2.04 2.04 0 0 0-1.92 0z"
        />
        <path
          style={{
            transform: `translate(${ICON_WIDTH *
              4}px, ${ICON_DY}px) scale(${ICON_SCALE})`,
          }}
          d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66l-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0L21 10.09V16c0 .55.45 1 1 1s1-.45 1-1V9.59c0-.37-.2-.7-.52-.88l-9.52-5.19a2.04 2.04 0 0 0-1.92 0z"
        />
      </clipPath>
    </defs>
  </svg>
);

export default MobileTooltip;
