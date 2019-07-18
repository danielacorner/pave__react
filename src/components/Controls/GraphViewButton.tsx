import React from 'react';
import { Button, Switch } from '@material-ui/core';
import styled from 'styled-components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { MenuItem, Select } from '@material-ui/core';
import { AUTOMATION_RISK } from './SortPanel';

const VariablePickerMenu = ({ value }) => (
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
    onChange={event => {
      // setValueToSortBy(event.target.value);
      // if (activeSwitches.includes(SORT_BY_VALUE)) {
      //   context.sortByValue(event.target.value, true);
      // }
    }}
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

const ButtonStyles = styled.div`
  position: fixed;
  bottom: 36px;
  right: 40px;
  button {
    text-transform: none;
    padding: 8px 24px;
  }
`;
export default ({ isGraphView, setIsGraphView, axisValues, setAxisValues }) => (
  <ButtonStyles>
    <FormControlLabel
      className="formControl graphView"
      control={
        <Switch
          onChange={() => {
            setIsGraphView(true);
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
          <VariablePickerMenu value={axisValues.x} />
          <div>to</div>
          <VariablePickerMenu value={axisValues.y} />
        </div>
      }
    />
  </ButtonStyles>
);
