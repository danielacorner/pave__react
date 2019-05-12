import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import RestoreIcon from '@material-ui/icons/RestoreRounded';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';
import { MenuItem, Select } from '@material-ui/core';
import FORCE from '../FORCE';

const white = 'rgba(255,255,255,0.98)';
const inactive2 = 'hsl(160, 50%, 50%)';
const hover2 = 'hsl(160, 50%, 45%)';

const getColourByValueText = valueToColourBy => {
  if (valueToColourBy === 'automationRisk') {
    return (
      <div>
        <div>
          Colour the circles by risk that the job will be replaced by machine
          work.
        </div>
        <div>
          Once coloured, look for{' '}
          <span style={{ color: 'rgb(180, 223, 117)' }}>green circles</span> to
          find jobs which won{"'"}t be taken over by machines for a long time.
          Darker green means lower risk.
          <div>
            Avoid high-risk{' '}
            <span style={{ color: 'rgb(253, 193, 114)' }}>red circles</span>.
          </div>
        </div>
      </div>
    );
  } else if (valueToColourBy === 'salary') {
    return (
      <div>
        <div>
          Colour the circles how much money is made by the average worker.
        </div>
        <div>
          Once coloured, look for{' '}
          <span style={{ color: 'rgb(170, 213, 107)' }}>
            dark green circles
          </span>{' '}
          to find jobs which make more money.
        </div>
      </div>
    );
  } else if (valueToColourBy === 'study') {
    return (
      <div>
        <div>
          Colour the circles how many years of study after high school for the
          average person working this job (not necessarily how many are required
          for the job).
        </div>
        <div>
          Once coloured, look for{' '}
          <span style={{ color: 'hsl(203,70%,70%)' }}>dark blue circles</span>{' '}
          to find jobs which require more study, or{' '}
          <span style={{ color: 'hsl(203,85%,85%)' }}>light blue circles</span>{' '}
          for jobs which require less study.
        </div>
      </div>
    );
  }
};

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
      background: white;
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
      margin-bottom: 10px;
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
    text-transform: none;
    background: white;
    max-height: 60px;
    padding: 2px 16px 0 16px;
    justify-self: end;
    align-self: center;
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

const SortPanel = ({ initialExpandedState, setExpanded, setLegendVisible }) => {
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
      context.sortType();
      if (!sortedParams.includes('category')) {
        setSortedParams([...sortedParams, 'category']);
      } else {
        setSortedParams(sortedParams.filter(d => d !== 'category'));
      }
    }
    if (sortBy === 'colourByValue') {
      context.colourByValue(valueToColourBy);
      if (!sortedParams.includes('colourByValue')) {
        setLegendVisible(false);
        setSortedParams([...sortedParams, 'colourByValue']);
      } else {
        setLegendVisible(true);
        setSortedParams(sortedParams.filter(d => d !== 'colourByValue'));
      }
    }
  };

  const [sortedParams, setSortedParams] = useState([]);
  const [valueToColourBy, setValueToColourBy] = useState('automationRisk');

  const context = useContext(ControlsContext);
  return (
    <SortButtonsStyles>
      <div className="sortBtnGroup">
        <Tooltip
          title={
            <div>
              <div>Sort by workers in each job.</div>
              <div>
                More workers means more people are needed right now -- but it
                doesn{"'"}t guarantee this type of job will be around forever.
              </div>
            </div>
          }
        >
          <FormControlLabel
            className="formControl sortBySize"
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
        </Tooltip>
        <Tooltip
          title={
            <div>
              <div>Sort by job industry.</div>
              <div>
                Spot the differences between the ten types of job. If you{"'"}re
                not sure what kind of work you want to do, look within
                industries with low Risk and high Salary.
              </div>
            </div>
          }
        >
          <FormControlLabel
            classes={{ root: 'formControlRoot' }}
            className="formControl sortByType"
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
        </Tooltip>
        <Tooltip title={getColourByValueText(valueToColourBy)}>
          <FormControlLabel
            classes={{ root: 'formControlRoot' }}
            className="formControl colourByValue"
            control={
              <Switch
                onChange={() =>
                  handleSort({
                    sortBy: 'colourByValue',
                    sortedParams,
                    context,
                    setSortedParams,
                  })
                }
                checked={sortedParams.includes('colourByValue')}
              />
            }
            label={
              <div className="labelAndSelect">
                <div>
                  Colour
                  {sortedParams && sortedParams.includes('colourByValue')
                    ? 'ed'
                    : ''}{' '}
                  by{' '}
                </div>
                <Select
                  classes={{ root: 'select' }}
                  value={valueToColourBy}
                  onClick={event => event.preventDefault()}
                  onMouseOver={event => {
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                  onTouchStart={event => {
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                  onChange={event => {
                    setValueToColourBy(event.target.value);
                    if (sortedParams.includes('colourByValue')) {
                      FORCE.colourByValue({
                        doColour: true,
                        variable: event.target.value,
                      });
                      context.setCurrentColor(event.target.value);
                    }
                  }}
                >
                  <MenuItem value="automationRisk">
                    <Tooltip
                      placement="right"
                      title={'Risk that tasks will be replaced by machine work'}
                    >
                      <div>Risk</div>
                    </Tooltip>
                  </MenuItem>
                  <MenuItem value="salary">
                    <Tooltip
                      placement="right"
                      title={'Average yearly income in $CAD'}
                    >
                      <div>Salary</div>
                    </Tooltip>
                  </MenuItem>
                  <MenuItem value="study">
                    <Tooltip
                      placement="right"
                      title={
                        'Average years of study for people working in this job (not necessarily required for the job)'
                      }
                    >
                      <div>Study</div>
                    </Tooltip>
                  </MenuItem>
                </Select>
              </div>
            }
          />
        </Tooltip>
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
