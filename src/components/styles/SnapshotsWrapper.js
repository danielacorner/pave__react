import styled from 'styled-components';
const SnapshotsWrapper = styled.div`
  margin: auto;
  /* padding: 10px; */
  display: grid;
  grid-gap: 10px;
  @media (min-width: 440px) {
    /* padding: 10px; */
  }
  .controlsBottom {
    display: grid;
    grid-gap: 10px;
    grid-auto-flow: column;
    justify-items: space-around;
    button {
      width: 100%;
    }
  }
  .snapshotsScrollContainer {
    overflow-y: scroll;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    height: 0px;
    transition: height 0.5s ease-in-out;
    &.open {
      height: 85px;
    }
  }
  .snapshotButton {
    display: grid;
    grid-auto-flow: row;
    text-transform: none;
    height: auto;
    img {
      width: 75px;
      height: 50px;
      margin-bottom: 4px;
      object-fit: fill;
    }
  }
`;
export default SnapshotsWrapper;
