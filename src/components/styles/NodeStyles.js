import styled from 'styled-components';

const NodeGroup = styled.g`
  circle {
    &:hover {
      cursor: pointer;
      stroke: rgba(0, 0, 0, 0.9);
      stroke-width: 2;
    }
  }
  .text-label {
    fill: honeydew;
    font-weight: 600;
    text-transform: uppercase;
    text-anchor: middle;
    alignment-baseline: middle;
    font-size: 10px;
    font-family: cursive;
  }
`;

export default NodeGroup;
