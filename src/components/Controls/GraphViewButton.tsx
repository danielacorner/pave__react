import React from 'react';
import { Switch } from '@material-ui/core';
import styled from 'styled-components/macro';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { MenuItem, Select } from '@material-ui/core';
import { AUTOMATION_RISK } from './SortPanel';

export const VariablePickerMenu = ({ value, onChange }) => (
  <Select
    classes={{ root: 'select' }}
    value={value}
    onClick={event => event.preventDefault()}
    onMouseOver={event => {
      event.stopPropagation();
      event.preventDefault();
    }}
    onTouchStart={event => {
      event.stopPropagation();
      event.preventDefault();
    }}
    {...onChange}
  >
    <MenuItem value="workers">
      <Tooltip placement="right" title={'Number of people working in this job'}>
        <div>Workers</div>
      </Tooltip>
    </MenuItem>
    <MenuItem value={AUTOMATION_RISK}>
      <Tooltip
        placement="right"
        title={'Risk that tasks will be replaced by machine work'}
      >
        <div>Risk</div>
      </Tooltip>
    </MenuItem>
    <MenuItem value="salary">
      <Tooltip placement="right" title={'Average yearly income in $CAD'}>
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
);

const GraphViewButtonStyles = styled.div`
  position: fixed;
  bottom: 25px;
  right: 29px;
  display: flex;
  padding: 4px 0 4px 12px;
  border-radius: 4px;
  background: #e0e0e0;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);

  .MuiFormControlLabel-root,
  .MuiFormControlLabel-label,
  .labelAndSelect {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-items: center;
    grid-gap: 6px;
  }
  .MuiFormControlLabel-root {
    display: flex;
    flex-direction: row-reverse;
    margin: 0;
  }
  .select {
    transform: scale(0.85);
  }
`;
export default ({ isGraphView, setIsGraphView, axisValues, setAxisValues }) => (
  <GraphViewButtonStyles>
    <FormControlLabel
      className="formControl graphView"
      control={
        <Switch
          onChange={() => {
            setIsGraphView(!isGraphView);
          }}
          checked={isGraphView}
        />
      }
      label={
        <div className="labelAndSelect">
          <div>
            Compar
            {isGraphView ? 'ing' : 'e'}
          </div>
          <VariablePickerMenu
            value={axisValues.x}
            onChange={event => {
              setAxisValues({ ...axisValues, x: event.target.value });
            }}
          />
          <div>to</div>
          <VariablePickerMenu
            value={axisValues.y}
            onChange={event => {
              setAxisValues({ ...axisValues, y: event.target.value });
            }}
          />
        </div>
      }
    />
  </GraphViewButtonStyles>
);
