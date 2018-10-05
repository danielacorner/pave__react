import React, { Component } from 'react';
import styled from 'styled-components';
import FilterSlider from './FilterSlider';
import { ControlsContext } from '../ContextProvider';
import { Button } from '@material-ui/core';

const Container = styled.div`
  /* margin: 10px 20px 0px 20px; */
  height: auto;
  display: grid;
  grid-gap: 10px;
  .slidersDiv {
    display: grid;
    grid-gap: 30px;
    @media (max-width: 500px) {
      grid-gap: 10px;
    }
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-items: center;
  }
`;

export default class FiltersPanel extends Component {
  render() {
    const { filterVariables } = this.props;
    return (
      <ControlsContext.Consumer>
        {context => (
          <Container>
            <div className="slidersDiv">
              {filterVariables.map(filterVar => {
                return (
                  <FilterSlider
                    key={filterVar}
                    filterVar={filterVar}
                    value={context.state.filters[filterVar]}
                    onChange={value => {
                      context.setFilter(filterVar, value);
                    }}
                    onMouseUp={context.handleSliderMouseup}
                  />
                );
              })}
            </div>
            {/* Hide Reset button if all filters are at 0 */}
            {Object.values(context.state.filters).reduce(
              (tot, curr) => tot + curr,
              0
            ) > 0 && (
              <Button onClick={context.resetFilters}>Reset Filters</Button>
            )}
          </Container>
        )}
      </ControlsContext.Consumer>
    );
  }
}
