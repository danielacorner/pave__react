import styled from 'styled-components';
const white = 'rgba(255,255,255,0.98)';
const black = 'rgba(0,0,0,0.98)';
const active1 = '#0e5aa2cc';
const hover1 = '#0a85fb';
const inactive1 = '#4BA7FFcc';
const active2 = '#52AE3E';
const hover2 = '#37b91b';
const inactive2 = '#A4E696';
const SortButtonsGrid = styled.div`
  /* width: 100%; */
  div {
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-gap: 20px; */
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.5);
    max-width: 450px;
    button {
      border-radius: 4px;
      transition: all 0.2s ease-in-out;
    }
    [value='size'] {
      color: rgba(0, 0, 0, 0.95);
      background: ${inactive1};
      &[class*='selected'] {
        color: ${white};
        background: ${active1};
      }
      &:hover {
        color: ${white};
        background: ${hover1};
      }
      &:after {
        display: none;
      }
    }
    [value='colour'] {
      color: ${black};
      background: ${inactive2};
      &[class*='selected'] {
        color: ${white};
        background: ${active2};
      }
      &:hover {
        color: ${white};
        background: ${hover2};
      }
      &:after {
        display: none;
      }
    }
  }
`;
export default SortButtonsGrid;
