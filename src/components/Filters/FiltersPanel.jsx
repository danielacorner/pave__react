import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { ControlsContext } from '../Context/ContextProvider';
import FilterSlidersGrid from '../styles/FilterSlidersGrid';
import FilterSlider from './FilterSlider';

const FiltersPanel = ({ filterVariables }) => {
  const context = useContext(ControlsContext);
  return (
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
  );
};

export default FiltersPanel;
