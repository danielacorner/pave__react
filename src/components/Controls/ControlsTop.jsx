import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import FilterSlider from './FilterSlider';

const Container = styled.div`
  margin: 10px 20px 20px 20px;
  height: auto;
  display: grid;
  grid-gap: 10px;
  .slidersDiv {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-items: center;
  }
  .buttonsDiv {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
`;
export default class ControlsTop extends Component {
  render() {
    const { filterVariables, data } = this.props;
    return (
      <Container>
        <div className="slidersDiv">
          {filterVariables.map(filterVar => {
            const dataArray = data.map(d => d[filterVar]);
            const filterRange = [
              Math.min(...dataArray),
              Math.max(...dataArray)
            ];
            return (
              <FilterSlider
                key={filterVar}
                filterRange={filterRange}
                filterVar={filterVar}
              />
            );
          })}
        </div>
        <div className="buttonsDiv">
          <Button variant="contained">Default</Button>
          <Button variant="contained" color="primary">
            Primary
          </Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
        </div>
      </Container>
    );
  }
}
