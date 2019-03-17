import { Collapse, IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/lab/Slider';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FILTER_RANGE,
  FILTER_TITLE,
  SUBSKILL_FILTER_TITLES,
} from '../../utils/constants';

const LabelAndSliderStyles = styled.div`
  position: relative;
  .expandLabel {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    .expand {
      padding: 5px;
      transform: rotate(0deg);
      margin-left: auto;
      transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      &.expandOpen {
        transform: rotate(180deg);
      }
    }
  }
  .subskillFilters {
  }
`;

const SubskillFilters = ({ filterVar }) => {
  const subskillFilters = SUBSKILL_FILTER_TITLES(filterVar);
  return (
    <div className="subskillFilters">
      {subskillFilters.map(subskill => (
        <div key={subskill} className="subskillLabelAndSlider">
          <Typography id="label">{subskill.title}</Typography>
          <Slider
            className="slider subskillSlider"
            // value={value}
            // min={FILTER_RANGE(filterVar)[0]}
            // max={FILTER_RANGE(filterVar)[1]}
            // step={1}
            // onChange={handleChange}
            // onMouseUp={onMouseUp}
            // onTouchEnd={onMouseUp}
          />
        </div>
      ))}
    </div>
  );
};

const FilterSlider = ({ value, filterVar, onMouseUp, onChange }) => {
  const handleChange = (event, value) => {
    onChange(value);
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <LabelAndSliderStyles className="labelAndSlider">
      <div className="expandLabel">
        <Typography id="label">{FILTER_TITLE(filterVar)}</Typography>
        <Tooltip title="View Sub-Skills">
          <IconButton
            className={`expand${expanded ? ' expandOpen' : ''}`}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Slider
        className="slider"
        value={value}
        min={FILTER_RANGE(filterVar)[0]}
        max={FILTER_RANGE(filterVar)[1]}
        step={1}
        onChange={handleChange}
        onMouseUp={onMouseUp}
        onTouchEnd={onMouseUp}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <SubskillFilters filterVar={filterVar} />
      </Collapse>
    </LabelAndSliderStyles>
  );
};
export default FilterSlider;
