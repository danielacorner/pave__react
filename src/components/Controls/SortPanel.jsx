import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import RestoreIcon from '@material-ui/icons/RestoreRounded';
import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { ControlsContext } from '../Context/ContextProvider';
import FORCE from '../FORCE';
import { INITIAL_EXPANDED_STATE } from '../AppLayout';
import { MOBILE_MIN_WIDTH } from '../../utils/constants';
import GraphViewButton, { VariablePickerMenu } from './GraphViewButton';

export const AUTOMATION_RISK = 'automationRisk';
export const AUTOMATION_RISK_LABEL = 'automationRisk';
export const COLOUR_BY_VALUE = 'colourByValue';
export const SORT_BY_VALUE = 'sortByValue';
export const WORKERS = 'workers';
export const SALARY = 'salary';
export const STUDY = 'study';
export const INDUSTRY = 'industry';
export const WORKERS_LABEL = 'workers';
export const SALARY_LABEL = 'salaryMed';
export const STUDY_LABEL = 'yearsStudy';
export const INDUSTRY_LABEL = 'industry';

const white = 'rgba(255,255,255,0.98)';
const inactive2 = 'hsl(160, 50%, 50%)';
const hover2 = 'hsl(160, 50%, 45%)';

const getTooltipText = (value, type) => {
  if (value === WORKERS) {
    // not available for type === COLOUR_BY_VALUE
    return (
      <div>
        <div>Sort the circles by number of people working in each job.</div>
        <div>
          Since people come and go, it may be easier to find a job in larger
          circles.
        </div>
      </div>
    );
  } else if (value === AUTOMATION_RISK) {
    return (
      <div>
        <div>
          {type === COLOUR_BY_VALUE ? 'Colour' : 'Sort'} the circles by risk
          that the job will be replaced by machine work.
        </div>
        {type === COLOUR_BY_VALUE ? (
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
  } else if (value === SALARY) {
    return (
      <div>
        <div>
          {type === COLOUR_BY_VALUE ? 'Colour' : 'Sort'} by how much money is
          made by the average worker.
        </div>
        {type === COLOUR_BY_VALUE ? (
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
  } else if (value === STUDY) {
    return (
      <div>
        <div>
          {type === COLOUR_BY_VALUE ? 'Colour' : 'Sort'} by years of study after
          high school for the average person working this job (not necessarily
          how many are required for the job).
        </div>
        {type === COLOUR_BY_VALUE ? (
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
  } else if (value === INDUSTRY) {
    // not available for type === SORT_BY_VALUE
    return (
      <div>
        <div>
          {type === COLOUR_BY_VALUE ? 'Colour' : 'Sort'} by job industry, or
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
      background-color: ${inactive2};
      color: ${white};
      &:hover {
        background-color: ${hover2};
      }
    }
  }
`;

const SortPanel = ({
  setIsExpanded,
  isGraphView,
  setIsGraphView,
  axisValues,
  setAxisValues,
}) => {
  const [activeSwitches, setActiveSwitches] = useState([]);
  const [valueToColourBy, setValueToColourBy] = useState(INDUSTRY);
  const [valueToSortBy, setValueToSortBy] = useState(WORKERS);
  const context = useContext(ControlsContext);

  const handleSort = ({
    toggleActivated,
    activeSwitches,
    setActiveSwitches,
  }) => {
    if (toggleActivated === SORT_BY_VALUE) {
      context.sortByValue(valueToSortBy);

      if (!activeSwitches.includes(SORT_BY_VALUE)) {
        setActiveSwitches([...activeSwitches, SORT_BY_VALUE]);
      } else {
        setActiveSwitches(activeSwitches.filter(d => d !== SORT_BY_VALUE));
      }
    }
    if (toggleActivated === COLOUR_BY_VALUE) {
      context.colourByValue(valueToColourBy);

      if (!activeSwitches.includes(COLOUR_BY_VALUE)) {
        setActiveSwitches([...activeSwitches, COLOUR_BY_VALUE]);
      } else {
        setActiveSwitches(activeSwitches.filter(d => d !== COLOUR_BY_VALUE));
      }
    }
  };

  const handleReset = () => {
    if (activeSwitches.includes(SORT_BY_VALUE)) {
      context.sortByValue(valueToSortBy);
    }
    if (activeSwitches.includes(COLOUR_BY_VALUE)) {
      context.colourByValue(valueToColourBy);
    }
    context.resetFilters();
    setIsExpanded(INITIAL_EXPANDED_STATE);
    setValueToSortBy(WORKERS);
    setValueToColourBy(INDUSTRY);
    setActiveSwitches([]);
  };
  return (
    <SortButtonsStyles>
      <div className="sortBtnGroup">
        <Tooltip title={getTooltipText(valueToSortBy, SORT_BY_VALUE)}>
          <FormControlLabel
            disabled={isGraphView}
            className="formControl sortByValue"
            control={
              <Switch
                onChange={() => {
                  handleSort({
                    toggleActivated: SORT_BY_VALUE,
                    activeSwitches,
                    setActiveSwitches,
                  });
                }}
                checked={activeSwitches.includes(SORT_BY_VALUE)}
              />
            }
            label={
              <div className="labelAndSelect">
                <div>
                  Sort
                  {activeSwitches && activeSwitches.includes(SORT_BY_VALUE)
                    ? 'ed'
                    : ''}{' '}
                  by{' '}
                </div>
                <VariablePickerMenu
                  value={valueToSortBy}
                  onChange={event => {
                    setValueToSortBy(event.target.value);
                    if (activeSwitches.includes(SORT_BY_VALUE)) {
                      context.sortByValue(event.target.value, true);
                    }
                  }}
                />
              </div>
            }
          />
        </Tooltip>
        <Tooltip title={getTooltipText(valueToColourBy, COLOUR_BY_VALUE)}>
          <FormControlLabel
            classes={{ root: 'formControlRoot' }}
            className="formControl colourByValue"
            control={
              <Switch
                onChange={() =>
                  handleSort({
                    toggleActivated: COLOUR_BY_VALUE,
                    activeSwitches,
                    setActiveSwitches,
                  })
                }
                checked={activeSwitches.includes(COLOUR_BY_VALUE)}
              />
            }
            label={
              <div className="labelAndSelect">
                <div>
                  Colour
                  {activeSwitches && activeSwitches.includes(COLOUR_BY_VALUE)
                    ? 'ed'
                    : ''}{' '}
                  by{' '}
                </div>
                <VariablePickerMenu
                  isIndustry={true}
                  value={valueToColourBy}
                  onChange={event => {
                    setValueToColourBy(event.target.value);
                    if (activeSwitches.includes(COLOUR_BY_VALUE)) {
                      FORCE.colourByValue({
                        doColour: true,
                        value: event.target.value,
                      });
                      context.setCurrentColor(event.target.value);
                    }
                  }}
                />
              </div>
            }
          />
        </Tooltip>
        <GraphViewButton
          {...{ isGraphView, setIsGraphView, axisValues, setAxisValues }}
        />
      </div>
      <Button
        className="btnReset"
        onClick={handleReset}
        disabled={
          // Disable Reset button if all filters are at 0
          !Object.values(context.state.filters).reduce(
            (tot, curr) => tot + curr,
            0,
          ) > 0 && activeSwitches.length === 0
        }
        variant="outlined"
      >
        <div>
          <RestoreIcon />
        </div>
        <div>Reset</div>
      </Button>
    </SortButtonsStyles>
  );
};
export default SortPanel;
