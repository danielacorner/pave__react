import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import React from 'react';

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

  return (
    <div>
      <Typography id="label">{filterTitle()}</Typography>
      <Slider
        style={{ width: 'auto' }}
        value={value}
        min={filterRange()[0]}
        max={filterRange()[1]}
        step={1}
        onChange={handleChange}
        onMouseUp={onMouseUp}
        onTouchEnd={onMouseUp}
      />
    </div>
  );
};
export default FilterSlider;
