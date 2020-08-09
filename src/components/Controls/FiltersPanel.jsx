import React from "react";
import styled from "styled-components/macro";
import { SLIDER_WIDTH_LG, SLIDER_WIDTH_MD } from "../../utils/constants";
import FilterSlider from "./FilterSlider";
import useStore from "../store";

const FiltersPanelStyles = styled.div`
  margin: 10px 0px 0px 6px;

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

const FiltersPanel = ({ filterVariables, isExpanded, setIsExpanded }) => {
  const handleFilterMouseup = useStore((state) => state.handleFilterMouseup);
  const handleFilterChange = useStore((state) => state.handleFilterChange);
  const filters = useStore((state) => state.filters);

  return (
    <FiltersPanelStyles>
      <div className="slidersDiv">
        {filterVariables.map((filterVar) => (
          <FilterSlider
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            key={filterVar}
            filterVar={filterVar}
            value={filters[filterVar]}
            onChange={(value) => {
              handleFilterChange(filterVar, value);
            }}
            onMouseUp={handleFilterMouseup}
          />
        ))}
      </div>
    </FiltersPanelStyles>
  );
};

export default FiltersPanel;
