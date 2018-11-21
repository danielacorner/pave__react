import styled from 'styled-components';
const SortButtonsGrid = styled.div`
  div {
    margin: 0 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-gap: 20px; */
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.5);
    button {
      border-radius: 4px;
      transition: all 0.2s ease-in-out;
    }
    [value='size'] {
      color: rgba(0, 0, 0, 0.95);
      background: #eefcce;
      &[class*='selected'] {
        color: rgba(255, 255, 255, 0.95);
        background: #98a184;
      }
      &:hover {
        color: rgba(255, 255, 255, 1);
        background: #98a184cc;
      }
      &:after {
        display: none;
      }
    }
    [value='colour'] {
      color: rgba(0, 0, 0, 0.95);
      background: #92afd7cc;
      &[class*='selected'] {
        color: rgba(255, 255, 255, 0.95);
        background: #85a0c4;
      }
      &:hover {
        color: rgba(255, 255, 255, 1);
        background: #85a0c4cc;
      }
      &:after {
        display: none;
      }
    }
  }
`;
export default SortButtonsGrid;
