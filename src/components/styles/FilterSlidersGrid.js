import styled from 'styled-components';
const FilterSlidersGrid = styled.div`
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
    div {
      display: grid;
      align-self: end;
    }
  }
`;
export default FilterSlidersGrid;
