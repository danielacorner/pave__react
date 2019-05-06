import React, { useContext } from 'react';
import styled from 'styled-components';
import { SLIDER_WIDTH_LG, SLIDER_WIDTH_MD } from '../../utils/constants';
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
    grid-template-columns: repeat(auto-fit, minmax(${SLIDER_WIDTH_LG}px, 1fr));
    align-items: center;
    @media (max-width: 490px) {
      grid-template-columns: repeat(
        auto-fit,
        minmax(${SLIDER_WIDTH_MD}px, 1fr)
      );
    }
    @media (max-width: 450px) {
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

const FiltersPanel = ({ filterVariables, expanded, setExpanded }) => {
  const context = useContext(ControlsContext);

  return (
    <FiltersPanelStyles>
      <div className="slidersDiv">
        {filterVariables.map(filterVar => (
          <FilterSlider
            expanded={expanded}
            setExpanded={setExpanded}
            key={filterVar}
            filterVar={filterVar}
            value={context.state.filters[filterVar]}
            onChange={value => {
              context.handleFilterChange(filterVar, value);
            }}
            Tooltipp={context.handleFilterMouseup}
          />
        ))}
      </div>
    </FiltersPanelStyles>
  );
};

export default FiltersPanel;
