import React from 'react';
import styled from 'styled-components';

const LegendStyles = styled.div`
  position: absolute;
  bottom: 25px;
  right: 20px;
  left: 20px;
  pointer-events: none;
  display: grid;
  grid-template-columns: 1fr auto;
  font-family: system-ui;
  .colours {
    display: grid;
    .colour {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      grid-gap: 7px;
      margin-top: 5px;
      .colourCircle {
        pointer-events: auto;
        border-radius: 100%;
        width: 15px;
        height: 15px;
        border: 1px solid black;
        .colourText {
        }
      }
    }
  }
  .sizes {
    display: grid;
    grid-template-rows: 1fr auto auto auto;
    grid-gap: 20px;
    .size {
      display: grid;
      grid-template-columns: 1fr 2.5fr;
      align-items: center;
      .sizeCircle {
        pointer-events: auto;
        justify-self: center;
        border: 1px solid black;
        border-radius: 100%;
      }
      .sizeText {
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
    <LegendStyles className="legend">
      <div className="colours">
        {colours.map(({ colour, text }) => (
          <div key={colour} className="colour">
            <div className="colourCircle" style={{ background: colour }} />
            <div className="colourText">{text}</div>
          </div>
        ))}
      </div>
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
};

export default Legend;
