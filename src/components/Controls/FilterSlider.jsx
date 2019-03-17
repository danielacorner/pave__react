import { Collapse, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/lab/Slider';
import React, { useState } from 'react';
import styled from 'styled-components';

const ExpandLabelStyles = styled.div`
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
`;

const FilterSlider = ({ value, filterVar, onMouseUp, onChange }) => {
  const handleChange = (event, value) => {
    onChange(value);
  };

  const filterTitle = () => {
    switch (filterVar) {
      case 'skillsLang':
        return 'Language & Communication';
      case 'skillsLogi':
        return 'Logic & Reasoning';
      case 'skillsMath':
        return 'Math & Spatial';
      case 'skillsComp':
        return 'Computer & Information';
      default:
        return;
    }
  };
  const filterRange = () => {
    switch (filterVar) {
      case 'skillsLang':
        return [0, 75];
      case 'skillsLogi':
        return [0, 75];
      case 'skillsMath':
        return [0, 75];
      case 'skillsComp':
        return [0, 75];
      default:
        return;
    }
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="labelAndSlider">
      <ExpandLabelStyles>
        <Typography id="label">{filterTitle()}</Typography>
        <IconButton
          className={`expand${expanded ? ' expandOpen' : ''}`}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </ExpandLabelStyles>
      <Slider
        className="slider"
        value={value}
        min={filterRange()[0]}
        max={filterRange()[1]}
        step={1}
        onChange={handleChange}
        onMouseUp={onMouseUp}
        onTouchEnd={onMouseUp}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit />
    </div>
  );
};
export default FilterSlider;
