import styled from 'styled-components';
const FilterSlidersGrid = styled.div`
  margin: 10px 20px 0px 20px;
  height: auto;
  display: grid;
  grid-gap: 10px;
  .slidersDiv {
    display: grid;
    grid-gap: 10px 30px;
    @media (max-width: 500px) {
      grid-gap: 10px;
    }
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-items: center;
  }
`;
export default FilterSlidersGrid;
