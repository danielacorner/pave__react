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

const getTooltipText = (value, type) => {
  if (value === 'workers') {
    // not available for type === 'colourByValue'
    return (
      <div>
        <div>Sort the circles by number of people working in each job.</div>
        <div>
          Since people come and go, it may be easier to find a job in larger
          circles.
        </div>
      </div>
    );
  } else if (value === 'automationRisk') {
    return (
      <div>
        <div>
          {type === 'colourByValue' ? 'Colour' : 'Sort'} the circles by risk
          that the job will be replaced by machine work.
        </div>
        {type === 'colourByValue' ? (
          <div>
            Once coloured, look for{' '}
            <span style={{ color: 'rgb(180, 223, 117)' }}>green circles</span>{' '}
            to find jobs which won{"'"}t be taken over by machines for a long
            time. Darker green means lower risk.
            <div>
              Avoid high-risk{' '}
              <span style={{ color: 'rgb(253, 193, 114)' }}>red circles</span>.
            </div>
          </div>
        ) : (
          <div>
            Once sorted, look{' '}
            <span style={{ fontWeight: 'bold' }}>higher up</span> to find jobs
            which won{"'"}t be taken over by machines for a long time. Avoid
            jobs lower down, which are at increased risk.
          </div>
        )}
      </div>
    );
  } else if (value === 'salary') {
    return (
      <div>
        <div>
          {type === 'colourByValue' ? 'Colour' : 'Sort'} by how much money is
          made by the average worker.
        </div>
        {type === 'colourByValue' ? (
          <div>
            Once coloured, look for{' '}
            <span style={{ color: 'rgb(170, 213, 107)' }}>
              dark green circles
            </span>{' '}
            to find jobs which make more money.
          </div>
        ) : (
          <div>
            Once sorted, look{' '}
            <span style={{ fontWeight: 'bold' }}>higher up</span> to find jobs
            with higher salaries.
          </div>
        )}
      </div>
    );
  } else if (value === 'study') {
    return (
      <div>
        <div>
          {type === 'colourByValue' ? 'Colour' : 'Sort'} by years of study after
          high school for the average person working this job (not necessarily
          how many are required for the job).
        </div>
        {type === 'colourByValue' ? (
          <div>
            Once coloured, look for{' '}
            <span style={{ color: 'hsl(203,70%,70%)' }}>dark blue circles</span>{' '}
            to find jobs which require more study, or{' '}
            <span style={{ color: 'hsl(203,85%,85%)' }}>
              light blue circles
            </span>{' '}
            for jobs which require less study.
          </div>
        ) : (
          <div>
            Once sorted, looking{' '}
            <span style={{ fontWeight: 'bold' }}>higher up</span> you'll find
            jobs that take a little longer to prepare for.
          </div>
        )}
      </div>
    );
  } else if (value === 'industry') {
    // not available for type === 'sortByValue'
    return (
      <div>
        <div>
          {type === 'colourByValue' ? 'Colour' : 'Sort'} by job industry, or
          groups of related jobs.
        </div>
        <div>
          Once you've worked in an industry, it's easier to find another job in
          the same industry.
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
    grid-template-columns: repeat(auto-fit, 220px);
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
    max-height: 60px;
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
  const handleSort = ({
    toggleActivated,
    activeSwitches,
    setActiveSwitches,
    context,
  }) => {
    if (toggleActivated === 'sortByValue') {
      context.sortSize();
      if (!activeSwitches.includes('sortByValue')) {
        setActiveSwitches([...activeSwitches, 'sortByValue']);
      } else {
        setActiveSwitches(activeSwitches.filter(d => d !== 'sortByValue'));
      }
    }
    if (toggleActivated === 'category') {
      context.sortType();
      if (!activeSwitches.includes('category')) {
        setActiveSwitches([...activeSwitches, 'category']);
      } else {
        setActiveSwitches(activeSwitches.filter(d => d !== 'category'));
      }
    }
    if (toggleActivated === 'colourByValue') {
      context.colourByValue(valueToColourBy);
      if (!activeSwitches.includes('colourByValue')) {
        setLegendVisible(false);
        setActiveSwitches([...activeSwitches, 'colourByValue']);
      } else {
        setLegendVisible(true);
        setActiveSwitches(activeSwitches.filter(d => d !== 'colourByValue'));
      }
    }
  };

  const [activeSwitches, setActiveSwitches] = useState([]);
  const [valueToColourBy, setValueToColourBy] = useState('industry');
  const [valueToSortBy, setValueToSortBy] = useState('workers');

  const context = useContext(ControlsContext);
  return (
    <SortButtonsStyles>
      <div className="sortBtnGroup">
        <Tooltip title={getTooltipText(valueToSortBy, 'sortByValue')}>
          <FormControlLabel
            className="formControl sortByValue"
            control={
              <Switch
                onChange={() => {
                  handleSort({
                    toggleActivated: 'sortByValue',
                    activeSwitches,
                    context,
                    setActiveSwitches,
                  });
                }}
                checked={activeSwitches.includes('sortByValue')}
              />
            }
            label={
              <div className="labelAndSelect">
                <div>
                  Sort
                  {activeSwitches && activeSwitches.includes('sortByValue')
                    ? 'ed'
                    : ''}{' '}
                  by{' '}
                </div>
                <Select
                  classes={{ root: 'select' }}
                  value={valueToSortBy}
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
                    setValueToSortBy(event.target.value);
                    if (activeSwitches.includes('sortByValue')) {
                      FORCE.sortByValue({
                        doColour: true,
                        variable: event.target.value,
                      });
                      context.setCurrentSort(event.target.value);
                    }
                  }}
                >
                  <MenuItem value="workers">
                    <Tooltip
                      placement="right"
                      title={'Number of people working in this job'}
                    >
                      <div>Workers</div>
                    </Tooltip>
                  </MenuItem>
                  {/* <MenuItem value="automationRisk">
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
                  </MenuItem> */}
                </Select>
              </div>
            }
          />
        </Tooltip>
        <Tooltip title={getTooltipText(valueToColourBy, 'colourByValue')}>
          <FormControlLabel
            classes={{ root: 'formControlRoot' }}
            className="formControl colourByValue"
            control={
              <Switch
                onChange={() =>
                  handleSort({
                    toggleActivated: 'colourByValue',
                    activeSwitches,
                    context,
                    setActiveSwitches,
                  })
                }
                checked={activeSwitches.includes('colourByValue')}
              />
            }
            label={
              <div className="labelAndSelect">
                <div>
                  Colour
                  {activeSwitches && activeSwitches.includes('colourByValue')
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
                    if (activeSwitches.includes('colourByValue')) {
                      FORCE.colourByValue({
                        doColour: true,
                        variable: event.target.value,
                      });
                      context.setCurrentColor(event.target.value);
                    }
                  }}
                >
                  <MenuItem value="industry">
                    <Tooltip
                      placement="right"
                      title={
                        'Job industry, jobs that are related to each other'
                      }
                    >
                      <div>Type</div>
                    </Tooltip>
                  </MenuItem>
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
        <RestoreIcon /> Reset
      </Button>
    </SortButtonsStyles>
  );
};
export default SortPanel;
