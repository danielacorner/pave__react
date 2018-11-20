import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';

const SortButtonsGrid = styled.div`
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
`;

export default class SortPanel extends Component {
  render() {
    return (
      <ControlsContext.Consumer>
        {context => (
          <SortButtonsGrid>
            <Button
              onClick={context.sortSize}
              variant="contained"
              color="primary"
            >
              Sort by Size
            </Button>
            <Button
              onClick={context.sortColour}
              variant="contained"
              color="secondary"
              style={{ color: '#fff' }}
            >
              Sort by Colour
            </Button>
          </SortButtonsGrid>
        )}
      </ControlsContext.Consumer>
    );
  }
}
