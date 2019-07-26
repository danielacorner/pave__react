import styled from 'styled-components/macro';
import { MOBILE_MIN_WIDTH } from '../../utils/constants';

const WHITE = 'rgba(255,255,255,0.98)';
const INACTIVE2 = 'hsl(160, 50%, 50%)';
const HOVER2 = 'hsl(160, 50%, 45%)';

export const SortPanelStyles = styled.div`
  position: relative;
  z-index: 1;
  min-height: 36px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  grid-gap: 6px;
  .sortBtnGroup {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, 225px);
    grid-gap: 6px;
    justify-items: start;
    .formControl {
      width: 100%;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.26);
      border-radius: 4px;
      display: grid;
      justify-items: start;
      grid-template-columns: auto 1fr;
    }
    @media (max-width: 399px) {
      grid-gap: 0px;
      margin-top: -10px;
      .formControl {
        border: none;
      }
    }
    label {
      margin: 0;
    }
    .labelAndSelect {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      .select {
        transform: scale(0.85);
      }
    }
  }
  button {
    border-radius: 4px;
    transition: all 0.1s ease-in-out;
    height: 100%;
  }
  .btnReset {
    text-transform: none;
    background: white;
    height: 40px;
    justify-self: end;
    align-self: start;
    padding: 0 8px 0 6px;
    .MuiButton-label {
      display: grid;
      align-items: center;
      grid-template-columns: auto auto;
      grid-gap: 4px;
      div {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-items: center;
      }
    }
    @media (min-width: ${MOBILE_MIN_WIDTH}px) {
      padding: 0 14px 0 10px;

      span {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto;
        grid-gap: 4px;
      }
    }
    &:not([disabled]) {
      background-color: ${INACTIVE2};
      color: ${WHITE};
      &:hover {
        background-color: ${HOVER2};
      }
    }
  }
`;
