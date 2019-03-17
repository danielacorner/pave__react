import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';
import FilterSlider from './FilterSlider';

const FiltersPanelStyles = styled.div`
  margin: 10px 20px 0px 20px;
  height: auto;
  display: grid;
  grid-gap: 10px;
  .slidersDiv {
    display: grid;
    grid-gap: 10px 30px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-items: center;
    @media (max-width: 490px) {
      grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
    }
    @media (max-width: 450px) {
      grid-gap: 10px;
      p {
        font-size: 0.775rem;
      }
    }
    .slider {
      display: grid;
      align-items: center;
      height: 30px;
    }
  }
`;

const FiltersPanel = ({ filterVariables }) => {
  const context = useContext(ControlsContext);
  return (
    <FiltersPanelStyles>
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
    </FiltersPanelStyles>
  );
};

export default FiltersPanel;
