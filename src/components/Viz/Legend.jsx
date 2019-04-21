import React, { useState } from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import { MOBLET_MIN_WIDTH } from '../../utils/constants';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const LegendStyles = styled.div`
  position: fixed;
  bottom: 25px;
  right: 20px;
  left: 20px;
  pointer-events: none;
  display: grid;
  grid-template-columns: auto 1fr auto;
  font-family: system-ui;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  .colours,
  .sizes {
    border-radius: 6px;
    .colourText,
    .sizeText {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 150px;
    }
    &:hover {
      .colour,
      .size {
        background: rgba(255, 255, 255, 0.8);
      }
      .colourText,
      .sizeText {
        max-width: none;
      }
      .colourText {
        padding-right: 7px;
      }
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
    display: grid;
    grid-template-rows: 1fr auto auto auto;
    .size {
      display: grid;
      grid-template-columns: 1fr 2.5fr;
      align-items: center;
      .sizeCircle {
        justify-self: center;
        border: 1px solid black;
        border-radius: 100%;
      }
      .sizeText {
        padding-top: 20px;
        pointer-events: auto;
        text-align: right;
      }
    }
  }
`;

const MobileLegendStyles = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white;
  z-index: 999;
  margin-top: -8px;
  display: grid;
  place-items: center;
  margin-left: -10px;
  margin-right: -10px;
  button {
    text-transform: none;
  }
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  &.expanded {
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
  }
  .icon {
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    &.flip {
      transform: rotate(180deg);
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
    grid-template-rows: 1fr auto auto auto;
    justify-content: start;
    align-items: center;
    grid-gap: 20px;
    padding-bottom: 20px;
    .size {
      display: grid;
      grid-template-columns: 1fr 2.5fr;
      align-items: center;
      .sizeCircle {
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
`;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// TODO: min, max radii based on radiusSelector
// TODO: highlight clusters on hover, click
const Legend = ({ colours, sizes, radiusScale }) => {
  const [legendExpanded, setLegendExpanded] = useState(false);
  return (
    <MediaQuery query={`(min-width: ${MOBLET_MIN_WIDTH}px)`}>
      {isMobletOrLarger => {
        if (isMobletOrLarger) {
          return (
            <LegendStyles>
              <div className="colours">
                {colours.map(({ colour, text }) => (
                  <div key={colour} className="colour">
                    <div className="colourCircleWrapper">
                      <div
                        className="colourCircle"
                        style={{ background: colour }}
                      />
                    </div>
                    <div className="colourText">{text}</div>
                  </div>
                ))}
              </div>
              <div className="spacer" />
              <div className="sizes">
                <div className="spacer" />
                {sizes.map(({ size, text }) => (
                  <div key={size} className="size">
                    <div
                      className="sizeCircle"
                      style={{
                        width: `${radiusScale(size)}px`,
                        height: `${radiusScale(size)}px`,
                      }}
                    />
                    <div className="sizeText">{numberWithCommas(text)}</div>
                  </div>
                ))}
              </div>
            </LegendStyles>
          );
        } else if (!isMobletOrLarger) {
          // TODO: mobile legend
          return (
            <MobileLegendStyles className={legendExpanded ? 'expanded' : ''}>
              <div className="btnWrapper">
                <Button
                  size="small"
                  onClick={() => setLegendExpanded(!legendExpanded)}
                >
                  Legend{' '}
                  <ExpandLessIcon
                    className={'icon' + (legendExpanded ? ' flip' : '')}
                  />
                </Button>
              </div>
              <Collapse in={legendExpanded}>
                <div className="colours">
                  {colours.map(({ colour, text }) => (
                    <div key={colour} className="colour">
                      <div className="colourCircleWrapper">
                        <div
                          className="colourCircle"
                          style={{ background: colour }}
                        />
                      </div>
                      <div className="colourText">{text}</div>
                    </div>
                  ))}
                </div>
                <div className="spacer" />
                <div className="sizes">
                  <div className="spacer" />
                  {sizes.map(({ size, text }) => (
                    <div key={size} className="size">
                      <div
                        className="sizeCircle"
                        style={{
                          width: `${radiusScale(size)}px`,
                          height: `${radiusScale(size)}px`,
                        }}
                      />
                      <div className="sizeText">{numberWithCommas(text)}</div>
                    </div>
                  ))}
                </div>
              </Collapse>
            </MobileLegendStyles>
          );
        }
      }}
    </MediaQuery>
  );
};

export default Legend;
