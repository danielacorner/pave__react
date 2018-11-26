import styled from 'styled-components';
const LayoutContainer = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-gap: 16px;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
`;
export default LayoutContainer;
