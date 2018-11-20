import React from 'react';
import FilterSlider from './FilterSlider';
import { ControlsContext } from '../Context/ContextProvider';
import { Button } from '@material-ui/core';
import FilterSlidersGrid from '../styles/FilterSlidersGrid';

const FiltersPanel = ({ filterVariables }) => (
  <ControlsContext.Consumer>
    {context => (
      <FilterSlidersGrid>
        <div className="slidersDiv">
          {filterVariables.map(filterVar => (
            <FilterSlider
              key={filterVar}
              filterVar={filterVar}
              value={context.state.filters[filterVar]}
              onChange={value => {
                context.handleFilterChange(filterVar, value);
              }}
              onMouseUp={context.handleSliderMouseup}
            />
          ))}
        </div>
        {/* Hide Reset button if all filters are at 0 */}
        {Object.values(context.state.filters).reduce(
          (tot, curr) => tot + curr,
          0,
        ) > 0 && (
          <Button onClick={context.resetFilters} variant="contained">
            Reset Filters
          </Button>
        )}
      </FilterSlidersGrid>
    )}
  </ControlsContext.Consumer>
);

export default FiltersPanel;
