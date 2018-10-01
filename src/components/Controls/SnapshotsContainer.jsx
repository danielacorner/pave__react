import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
`;

export default class SnapshotsContainer extends Component {
  render() {
    return <Container>Snapshots over here</Container>;
  }
}
