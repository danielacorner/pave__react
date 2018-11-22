import styled from 'styled-components';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-self: center;
  align-self: center;
  svg {
    background-color: #4682b445;
    width: 100%;
    height: 100%;
    #nodesG {
      transition: transform 0.5s ease-in-out;
      transform: translate(50%, 50%);
    }
    #summaryBar {
      transition: all 0.5s;
    }
    text {
      font-family: roboto light;
    }
  }
`;
export default GraphContainer;
