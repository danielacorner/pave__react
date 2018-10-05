import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const Container = styled.div`
  /* margin: 20px; */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;

export default class SortPanel extends Component {
  render() {
    return (
      <Container>
        <Button variant="contained">Default</Button>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
      </Container>
    );
  }
}
