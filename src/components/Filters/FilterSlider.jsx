import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

export default class FilterSlider extends Component {
  handleChange = (event, value) => {
    this.props.onChange(value);
  };

  render() {
    const { value, filterVar } = this.props;
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
          onChange={this.handleChange}
          onMouseUp={this.props.onMouseUp}
          onTouchEnd={this.props.onMouseUp}
        />
      </div>
    );
  }
}
