import React, { Component } from 'react';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

export default class FilterSlider extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const { value } = this.state;
    const { filterRange, filterVar } = this.props;
    const filterTitle = () => {
      switch (filterVar) {
        case 'skillsLang':
          return 'Language and Communication';
        case 'skillsLogi':
          return 'Logic and Reasoning';
        case 'skillsMath':
          return 'Math and Spatial';
        case 'skillsComp':
          return 'Computer and Information';
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
          min={filterRange[0]}
          max={filterRange[1]}
          step={1}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
