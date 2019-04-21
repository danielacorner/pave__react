import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import { MOBLET_MIN_WIDTH } from '../../utils/constants';

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
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// TODO: min, max radii based on radiusSelector
// TODO: highlight clusters on hover, click
const Legend = ({ colours, sizes, radiusScale }) => {
  return (
    <MediaQuery query={`(min-width: ${MOBLET_MIN_WIDTH}px)`}>
      {isMobletOrLarger => {
        if (isMobletOrLarger) {
          return (
            <LegendStyles className="legend">
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
          return null;
        }
      }}
    </MediaQuery>
  );
};

export default Legend;
