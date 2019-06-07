import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { MOBILE_MIN_WIDTH, TABLET_MIN_WIDTH } from '../../utils/constants';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Portal } from '@material-ui/core';

const LegendButtonStyles = styled.div`
  button {
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: fixed;
    z-index: 99;
    bottom: 10px;
    left: 10px;
    @media (min-width: ${TABLET_MIN_WIDTH - 200}px) {
      bottom: 36px;
      left: 40px;
    }
    text-transform: none;
  }
  .icon {
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    &.flip {
      transform: rotate(180deg);
    }
  }
`;

const LegendStyles = styled.div`
  .collapse {
    background: white;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    padding: 0 20px;
    z-index: 1;
  }
  font-family: system-ui;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 98;
  margin-top: -8px;
  display: grid;
  place-items: center;
  margin-left: -10px;
  margin-right: -10px;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  &.expanded {
    .collapse {
      padding: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
    }
  }
  .colours,
  .sizes {
    margin-left: 10px;
    .colourText,
    .sizeText {
    }
  }
  .colours {
    display: grid;
    .colour {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      grid-gap: 7px;
      .colourCircleWrapper {
        padding-top: 5px;
        pointer-events: auto;
      }
      .colourCircle {
        border-radius: 100%;
        width: 15px;
        height: 15px;
        border: 1px solid black;
      }
    }
  }
  .sizes {
    margin-left: 10px;
    display: grid;
    justify-content: start;
    align-items: center;
    padding-bottom: 20px;
    @media (min-width: ${MOBILE_MIN_WIDTH}px) {
      padding-bottom: 80px;
    }
    grid-gap: 5%;
    .size {
      min-height: 30px;
      display: grid;
      grid-template-columns: 1fr 2.5fr;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      .sizeCircle {
        transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
        justify-self: center;
        border: 1px solid black;
        border-radius: 100%;
      }
      .sizeText {
        pointer-events: auto;
        text-align: right;
      }
    }
  }
  .title {
    margin: 20px 0 8px 8px;
    font-size: 24px;
  }
`;

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// TODO: min, max radii based on radiusSelector
// TODO: highlight clusters on hover, click
const Legend = ({ colours, sizes, radiusScale }) => {
  const [legendExpanded, setLegendExpanded] = useState(false);

  return (
    <LegendStyles className={legendExpanded ? 'expanded' : ''}>
      <Portal>
        <LegendButtonStyles className="btnLegendWrapper">
          <Button
            variant="contained"
            size="large"
            style={{ padding: '8px 16px 8px 24px' }}
            onClick={() => setLegendExpanded(!legendExpanded)}
          >
            Legend{' '}
            <ExpandLessIcon
              className={'icon' + (legendExpanded ? ' flip' : '')}
            />
          </Button>
        </LegendButtonStyles>
      </Portal>
      <Collapse className="collapse" in={legendExpanded}>
        <div className="title">Career Industries</div>
        <div className="colours">
          {colours.map(({ colour, text }) => (
            <div key={colour} className="colour">
              <div className="colourCircleWrapper">
                <div className="colourCircle" style={{ background: colour }} />
              </div>
              <div className="colourText">{text}</div>
            </div>
          ))}
        </div>
        <div className="spacer" />
        <div className="title">Career Sizes</div>
        <div className="sizes">
          {sizes.map(({ size, text }, idx) => (
            <div key={size} className={`size size${idx + 1}`}>
              <div
                className="sizeCircle"
                style={{
                  width: `${radiusScale(size) * 2}px`,
                  height: `${radiusScale(size) * 2}px`,
                }}
              />
              <div className="sizeText">{numberWithCommas(text)}</div>
            </div>
          ))}
        </div>
      </Collapse>
    </LegendStyles>
  );
};

export default Legend;
