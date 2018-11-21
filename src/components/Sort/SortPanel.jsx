import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';

const SortButtonsGrid = styled.div`
  div {
    margin: 0 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-gap: 20px; */
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
    button {
      border-radius: 4px;
      transition: all 0.2s ease-in-out;
    }
    [value='size'] {
      color: rgba(0, 0, 0, 0.95);
      background: #eefcce;
      &:hover,
      &[class*='selected'] {
        color: rgba(255, 255, 255, 0.95);
        background: #98a184;
      }
    }
    [value='colour'] {
      color: rgba(0, 0, 0, 0.95);
      background: #92afd7cc;
      &:hover,
      &[class*='selected'] {
        color: rgba(255, 255, 255, 0.95);
        background: #85a0c4;
      }
    }
  }
`;

export default class SortPanel extends Component {
  state = {
    sortingColour: false,
    sortingSize: false,
    sorted: [],
  };

  handleSort = (event, sorted, context) => {
    // symmetric difference between arrays
    const difference = (arr1, arr2) => {
      if (!arr1) return arr2;
      if (!arr2) return arr1;
      return arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
    };

    // if sorting colour (state.sorted changed by 'colour'), sort colour
    if (difference(this.state.sorted, sorted).includes('colour')) {
      context.sortColour();
      this.setState({
        sortingColour:
          !this.state.sorted || !this.state.sorted.includes('colour'),
        sorted,
      });
    }
    if (difference(this.state.sorted, sorted).includes('size')) {
      context.sortSize();
      this.setState({
        sortingSize: !this.state.sorted || !this.state.sorted.includes('size'),
        sorted,
      });
    }
    setTimeout(
      () => this.setState({ sortingColour: false, sortingSize: false }),
      500,
    );
  };
  render() {
    const { sorted, sortingColour, sortingSize } = this.state;
    return (
      <ControlsContext.Consumer>
        {context => (
          <SortButtonsGrid>
            <ToggleButtonGroup
              value={sorted}
              onChange={(event, sorted) =>
                this.handleSort(event, sorted, context)
              }
            >
              <ToggleButton value="size" disabled={sortingSize}>
                {`Sort${
                  sortingSize
                    ? 'ing'
                    : sorted && sorted.includes('size')
                    ? 'ed'
                    : ''
                } by Size`}
              </ToggleButton>
              <ToggleButton value="colour" disabled={sortingColour}>
                {`Sort${
                  sortingColour
                    ? 'ing'
                    : sorted && sorted.includes('colour')
                    ? 'ed'
                    : ''
                } by Colour`}
              </ToggleButton>
            </ToggleButtonGroup>
          </SortButtonsGrid>
        )}
      </ControlsContext.Consumer>
    );
  }
}
