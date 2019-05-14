import React, { useState } from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import { NEVER_MIN_WIDTH, MOBILE_MIN_WIDTH } from '../../utils/constants';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

// const LegendStyles = styled.div`
//   position: fixed;
//   bottom: 25px;
//   right: 20px;
//   left: 20px;
//   pointer-events: none;
//   display: grid;
//   grid-template-columns: auto 1fr auto;
//   font-family: system-ui;
//   opacity: 0.5;
//   &:hover {
//     opacity: 1;
//   }
//   .colours,
//   .sizes {
//     border-radius: 6px;
//     .colourText,
//     .sizeText {
//       text-overflow: ellipsis;
//       overflow: hidden;
//       white-space: nowrap;
//       max-width: 150px;
//     }
//     &:hover {
//       .colour,
//       .size {
//         background: rgba(255, 255, 255, 0.8);
//       }
//       .colourText,
//       .sizeText {
//         max-width: none;
//       }
//       .colourText {
//         padding-right: 7px;
//       }
//     }
//   }
//   .coloursWrapper {
//     display: grid;
//     align-content: end;
//   }
//   .colours {
//     display: grid;
//     .colour {
//       display: grid;
//       grid-template-columns: auto 1fr;
//       align-items: center;
//       grid-gap: 7px;
//       .colourCircleWrapper {
//         padding-top: 5px;
//         pointer-events: auto;
//       }
//       .colourCircle {
//         border-radius: 100%;
//         width: 15px;
//         height: 15px;
//         border: 1px solid black;
//       }
//     }
//   }
//   .sizes {
//     display: grid;
//     grid-template-rows: 1fr auto auto auto;
//     .size {
//       display: grid;
//       grid-template-columns: 1fr auto;
//       align-items: center;
//       padding-top: 20px;
//       transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
//       .sizeCircle {
//         transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
//         justify-self: center;
//         border: 1px solid black;
//         border-radius: 100%;
//       }
//       .sizeText {
//         pointer-events: auto;
//         text-align: right;
//       }
//     }
//   }
// `;

const MobileLegendStyles = styled.div`
  .collapse {
    background: white;
    position: fixed;
    bottom: 0;
    height: 0;
    padding: 0 20px;
    z-index: 1;
  }
  .btnLegendWrapper {
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: fixed;
    z-index: 10;
    bottom: 20px;
    left: 20px;
    @media (min-width: ${MOBILE_MIN_WIDTH + 50}px) {
      bottom: 36px;
      left: 40px;
    }
  }
  font-family: system-ui;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
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
    .collapse {
      padding: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
    }
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
    justify-content: start;
    align-items: center;
    padding-bottom: 20px;
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// TODO: min, max radii based on radiusSelector
// TODO: highlight clusters on hover, click
const Legend = ({ colours, sizes, radiusScale }) => {
  const [legendExpanded, setLegendExpanded] = useState(false);

  return (
    <MediaQuery query={`(min-width: ${NEVER_MIN_WIDTH}px)`}>
      {isAboveBreakpoint => {
        if (isAboveBreakpoint) {
          return (
            // <LegendStyles>
            //   <div className="coloursWrapper">
            //     <div className="title">Career Industries</div>
            //     <div className="colours">
            //       {colours.map(({ colour, text }) => (
            //         <div key={colour} className="colour">
            //           <div className="colourCircleWrapper">
            //             <div
            //               className="colourCircle"
            //               style={{ background: colour }}
            //             />
            //           </div>
            //           <div className="colourText">{text}</div>
            //         </div>
            //       ))}
            //     </div>
            //   </div>
            //   <div className="spacer" />
            //   <div className="sizes">
            //     <div className="title">Career Sizes</div>
            //     <div className="spacer" />
            //     {sizes.map(({ size, text }, idx) => (
            //       <div key={size} className={`size size${idx + 1}`}>
            //         <div
            //           className="sizeCircle"
            //           style={{
            //             width: `${radiusScale(size) * 2}px`,
            //             height: `${radiusScale(size) * 2}px`,
            //           }}
            //         />
            //         <div className="sizeText">{numberWithCommas(text)}</div>
            //       </div>
            //     ))}
            //   </div>
            // </LegendStyles>
            null
          );
        } else if (!isAboveBreakpoint) {
          return (
            <MobileLegendStyles className={legendExpanded ? 'expanded' : ''}>
              <div className="btnLegendWrapper">
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
              </div>
              <Collapse className="collapse" in={legendExpanded}>
                <div className="title">Career Industries</div>
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
            </MobileLegendStyles>
          );
        }
      }}
    </MediaQuery>
  );
};

export default Legend;
