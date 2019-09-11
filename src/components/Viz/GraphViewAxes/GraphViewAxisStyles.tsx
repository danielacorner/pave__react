import styled from 'styled-components/macro';
import { MOBILE_MIN_WIDTH } from '../../../utils/constants';
import { AXIS_HEIGHT } from '../Viz';
export const AxisStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  transition: all 2s ease-in-out;
  &.hidden {
    transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);
    opacity: 0;
    .axis .tickAndLabelWrapper {
      opacity: 0;
    }
    .axisX {
      transform: translateY(-10px);
    }
    .axisY {
      transform: translateX(-10px);
    }
  }
  .axis {
    .tickAndLabelWrapper {
      transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);
      width: 0;
      position: relative;
      .label {
        position: absolute;
        font-family: system-ui;
        transform: scale(0.75);
        @media (min-width: ${MOBILE_MIN_WIDTH}px) {
          transform: scale(1);
        }
      }
      .tick {
        background: rgba(0, 0, 0, 0.7);
        box-sizing: border-box;
      }
    }
  }
  .axisX {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    .tick {
      min-width: 1px;
      width: 1px;
      min-height: 6px;
    }
    .label {
      transform-origin: left center;
      left: -1.2ch;
    }
  }
  .axisY {
    height: 100%;
    display: grid;
    align-content: center;
    .tick {
      width: 6px;
      min-height: 1px;
      height: 1px;
    }
    .label {
      transform-origin: top center;
      top: -1.4ch;
      left: 8px;
    }
  }
`;
export const GraphViewAxisTitlesStyles = styled.div`
  pointer-events: none;
  position: absolute;
  display: grid;
  justify-items: center;
  width: 100%;
  height: 100%;
  font-family: system-ui;
  font-size: 1em;
  line-height: 1em;
  .axisTitle {
    white-space: nowrap;
    position: absolute;
    transition: all 1s ease-in-out;
    &.hidden,
    &.hidden .titleWrapper {
      opacity: 0;
      transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
  .axisTitleX {
    margin-right: ${-AXIS_HEIGHT / 2}px;
    &.hidden {
      transform: translateY(10px);
    }
  }
  .axisTitleY {
    height: 100%;
    width: 100%;
    text-align: center;
    display: grid;
    .titleWrapper {
      display: grid;
      align-items: center;
      justify-content: center;
      margin-top: ${AXIS_HEIGHT / 2}px;
      height: 100%;
      transform: rotate(-90deg);
      width: 0;
    }
    &.hidden {
      transform: translateX(10px);
      .titleWrapper {
        transform: rotate(-90deg) translateY(10px);
      }
    }
  }
  @media (min-width: ${MOBILE_MIN_WIDTH}px) {
    line-height: 0;
    font-size: 1.5em;
    .titleWrapper {
      width: 1em;
    }
  }
`;
