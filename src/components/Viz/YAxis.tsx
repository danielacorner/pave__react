import React, { useState, useEffect, useContext } from 'react';
import { ControlsContext } from '../Context/ContextProvider';
import styled from 'styled-components';
import { WORKERS, SALARY, AUTOMATION_RISK, STUDY } from '../Controls/SortPanel';
import { numberWithCommas } from './Legend';
import { useWindowSize } from '../useWindowSize';

const YAxisStyles = styled.div`
  position: absolute;
  left: 0;
  width: 2px;
  height: 100%;
  border: 1px solid tomato;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .spacer {
    transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .tick {
    margin-left: 4px;
    display: flex;
    max-height: 3px;
    min-height: 3px;
    width: 10px;
    background: black;
    transition: all 3s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: relative;
    font-family: system-ui;
    .label {
      position: absolute;
      top: -10.5px;
      left: 14px;
      .label-data {
        font-size: 1em;
      }
      .label-subtitle {
        width: 50px;
        font-size: 0.8em;
      }
    }
    /* margin: 200% 0; */
    &.hidden {
      opacity: 0;
    }
    /* &.workers {
      margin: 33% 0;
    }
    &.automationRisk {
      margin: 40% 0;
    }
    &.study {
      margin: 50% 0;
    }
    &.salary {
      margin: 50% 0;
    } */
  }
`;
const getLabel = (sortedByValue, idx) => {
  let num;
  switch (sortedByValue) {
    case WORKERS:
      num = idx === 0 ? 100000 : idx === 1 ? 25000 : 1000;
      return (
        <>
          <div className="label-data">{numberWithCommas(num)} </div>
          <div className="label-subtitle">workers</div>
        </>
      );
    case SALARY:
      num = idx === 0 ? 100 : idx === 1 ? 40 : 20;
      return (
        <>
          <div className="label-data">${num}k </div>
          <div className="label-subtitle">per year</div>
        </>
      );
    case AUTOMATION_RISK:
      num = idx === 0 ? 10 : idx === 1 ? 50 : 90;
      return (
        <>
          <div className="label-data">{num}% </div>
          <div className="label-subtitle">risk</div>
        </>
      );
    case STUDY:
      num = idx === 0 ? 5 : idx === 1 ? 3 : 1;
      return (
        <div>
          <div className="label-data">{num} </div>
          <div
            className="label-subtitle"
            style={{ margin: '-1.4em 0 0 1.9em' }}
          >
            year{num !== 1 ? 's' : ''} study
          </div>
        </div>
      );

    default:
      break;
  }
};

export default () => {
  // TODO: set scaleY of .spacer on handleResize
  const { state } = useContext(ControlsContext);
  const { sortedByValue } = state;
  const [marginPercent, setMarginPercent] = useState(0.5);
  const { innerHeight } = useWindowSize();
  useEffect(() => {
    switch (sortedByValue) {
      case WORKERS:
        setMarginPercent(0.11);
        break;
      case SALARY:
        setMarginPercent(0.11);
        break;
      case AUTOMATION_RISK:
        setMarginPercent(0.09);
        break;
      case STUDY:
        setMarginPercent(0.13);
        break;
      default:
        setMarginPercent(0.5);
        break;
    }
  }, [sortedByValue]);

  return (
    <YAxisStyles style={{}} className="yAxis">
      <div className={`tick ${sortedByValue || 'hidden'}`}>
        <div className="label">{getLabel(sortedByValue, 0)}</div>
      </div>
      <div
        className="spacer"
        style={{ margin: `${marginPercent * innerHeight}px 0` }}
      />
      <div className={`tick ${sortedByValue || 'hidden'}`}>
        <div className="label">{getLabel(sortedByValue, 1)}</div>
      </div>
      <div
        className="spacer"
        style={{ margin: `${marginPercent * innerHeight}px 0` }}
      />
      <div className={`tick ${sortedByValue || 'hidden'}`}>
        <div className="label">{getLabel(sortedByValue, 2)}</div>
      </div>
    </YAxisStyles>
  );
};
