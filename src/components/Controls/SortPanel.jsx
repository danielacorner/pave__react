import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RestoreIcon from '@material-ui/icons/RestoreRounded';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';
import { MenuItem, Select } from '@material-ui/core';
import FORCE from '../FORCE';

const white = 'rgba(255,255,255,0.98)';
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
    width: 100%;
    grid-template-columns: repeat(auto-fit, 180px);
    grid-gap: 6px;
    justify-items: start;
    .formControl {
      width: 180px;
      border: 1px solid rgba(0, 0, 0, 0.26);
      border-radius: 4px;
      display: grid;
      justify-items: start;
      grid-template-columns: auto 1fr;
      &:last-child {
        width: 215px;
      }
    }
    @media (max-width: 399px) {
      grid-gap: 0px;
      margin-top: -10px;
      .formControl {
        height: 36px;
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
    max-height: 60px;
    padding: 2px 16px 0 16px;
    justify-self: end;
    align-self: start;
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

const SortPanel = ({ initialExpandedState, setExpanded }) => {
  const handleSort = ({ sortBy, sortedParams, setSortedParams, context }) => {
    if (sortBy === 'size') {
      context.sortSize();
      if (!sortedParams.includes('size')) {
        setSortedParams([...sortedParams, 'size']);
      } else {
        setSortedParams(sortedParams.filter(d => d !== 'size'));
      }
    }
    if (sortBy === 'category') {
      context.sortColour();
      if (!sortedParams.includes('category')) {
        setSortedParams([...sortedParams, 'category']);
      } else {
        setSortedParams(sortedParams.filter(d => d !== 'category'));
      }
    }
    if (sortBy === 'colour') {
      context.colourByValue(valueToColourBy);
      if (!sortedParams.includes('colour')) {
        setSortedParams([...sortedParams, 'colour']);
      } else {
        setSortedParams(sortedParams.filter(d => d !== 'colour'));
      }
    }
  };

  const [sortedParams, setSortedParams] = useState([]);
  const [valueToColourBy, setValueToColourBy] = useState('automationRisk');

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
          classes={{ root: 'formControlRoot' }}
          className="formControl"
          control={
            <Switch
              onChange={() =>
                handleSort({
                  sortBy: 'category',
                  sortedParams,
                  context,
                  setSortedParams,
                })
              }
              checked={sortedParams.includes('category')}
            />
          }
          label={`Sort${
            sortedParams && sortedParams.includes('category') ? 'ed' : ''
          } by Type`}
        />
        <FormControlLabel
          classes={{ root: 'formControlRoot' }}
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
          label={
            <div className="labelAndSelect">
              <div>
                Colour
                {sortedParams && sortedParams.includes('colour')
                  ? 'ed'
                  : ''} by{' '}
              </div>
              <Select
                classes={{ root: 'select' }}
                value={valueToColourBy}
                onClick={event => event.preventDefault()}
                onChange={event => {
                  setValueToColourBy(event.target.value);
                  if (sortedParams.includes('colour')) {
                    FORCE.colourByValue({
                      doColour: true,
                      variable: event.target.value,
                    });
                  }
                }}
              >
                <MenuItem value="automationRisk">Risk</MenuItem>
                <MenuItem value="salary">Salary</MenuItem>
                <MenuItem value="study">Study</MenuItem>
              </Select>
            </div>
          }
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
