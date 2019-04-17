import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RestoreIcon from '@material-ui/icons/RestoreRounded';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';

const white = 'rgba(255,255,255,0.98)';
const whiteActive = 'hsl(0, 0%, 75%)';
const inactive = 'hsl(190, 50%, 50%)';
const hover = 'hsl(190, 50%, 45%)';
const active = 'hsl(190, 40%, 40%)';
const hoverActive = 'hsl(190, 40%, 35%)';
const inactive2 = 'hsl(160, 50%, 50%)';
const hover2 = 'hsl(160, 50%, 45%)';

const SortButtonsStyles = styled.div`
  position: relative;
  z-index: 1;
  min-height: 36px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  grid-gap: 6px;
  .sortBtnGroup {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    grid-gap: 6px;
    justify-items: start;
    .formControl {
      width: 180px;
      border: 1px solid rgba(0, 0, 0, 0.26);
      border-radius: 4px;
      display: grid;
      justify-items: start;
      grid-template-columns: auto 1fr;
    }
    label {
      margin: 0;
    }
  }
  button {
    border-radius: 4px;
    transition: all 0.1s ease-in-out;
    height: 100%;
  }
  [value='size'] {
    background: ${inactive};
    color: ${white};
    &:hover {
      background: ${hover};
    }
    &[class*='selected'] {
      color: ${whiteActive};
      background: ${active};
      &:hover {
        background: ${hoverActive};
      }
    }
    &:after {
      display: none;
    }
  }
  [value='colour'] {
    color: ${white};
    background: ${inactive};
    &:hover {
      background: ${hover};
    }
    &[class*='selected'] {
      color: ${whiteActive};
      background: ${active};
      &:hover {
        background: ${hoverActive};
      }
    }
    &:after {
      display: none;
    }
  }
  .btnReset {
    padding: 2px 16px 0 16px;
    justify-self: end;
    span {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-gap: 4px;
    }
    &:not([disabled]) {
      background-color: ${inactive2};
      color: ${white};
      &:hover {
        background-color: ${hover2};
      }
    }
  }
`;

const handleSort = ({ sortBy, sortedParams, setSortedParams, context }) => {
  if (sortBy === 'size') {
    context.sortSize();
    if (!sortedParams.includes('size')) {
      setSortedParams([...sortedParams, 'size']);
    } else {
      setSortedParams(sortedParams.filter(d => d !== 'size'));
    }
  }
  if (sortBy === 'colour') {
    context.sortColour();
    if (!sortedParams.includes('colour')) {
      setSortedParams([...sortedParams, 'colour']);
    } else {
      setSortedParams(sortedParams.filter(d => d !== 'colour'));
    }
  }
  if (sortBy === 'risk') {
    context.sortRisk();
    if (!sortedParams.includes('risk')) {
      setSortedParams([...sortedParams, 'risk']);
    } else {
      setSortedParams(sortedParams.filter(d => d !== 'risk'));
    }
  }
};

const SortPanel = ({ initialExpandedState, setExpanded }) => {
  const [sortedParams, setSortedParams] = useState([]);

  const context = useContext(ControlsContext);
  return (
    <SortButtonsStyles>
      <div className="sortBtnGroup">
        <FormControlLabel
          className="formControl"
          control={
            <Switch
              onChange={() => {
                handleSort({
                  sortBy: 'size',
                  sortedParams,
                  context,
                  setSortedParams,
                });
              }}
              checked={sortedParams.includes('size')}
            />
          }
          label={`Sort${
            sortedParams && sortedParams.includes('size') ? 'ed' : ''
          } by Size`}
        />
        <FormControlLabel
          className="formControl"
          control={
            <Switch
              onChange={() =>
                handleSort({
                  sortBy: 'colour',
                  sortedParams,
                  context,
                  setSortedParams,
                })
              }
              checked={sortedParams.includes('colour')}
            />
          }
          label={`Sort${
            sortedParams && sortedParams.includes('colour') ? 'ed' : ''
          } by Type`}
        />
        <FormControlLabel
          className="formControl"
          control={
            <Switch
              onChange={() =>
                handleSort({
                  sortBy: 'risk',
                  sortedParams,
                  context,
                  setSortedParams,
                })
              }
              checked={sortedParams.includes('risk')}
            />
          }
          label={`Colour${
            sortedParams && sortedParams.includes('risk') ? 'ed' : ''
          } by Risk`}
        />
      </div>
      <Button
        className="btnReset"
        onClick={() => {
          setExpanded(initialExpandedState);
          context.resetFilters();
        }}
        disabled={
          // Disable Reset button if all filters are at 0
          !Object.values(context.state.filters).reduce(
            (tot, curr) => tot + curr,
            0,
          ) > 0
        }
        variant="outlined"
      >
        <RestoreIcon /> Reset Filters
      </Button>
    </SortButtonsStyles>
  );
};
export default SortPanel;
