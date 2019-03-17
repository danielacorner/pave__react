import { Button } from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/RestoreRounded';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ControlsContext } from '../Context/ContextProvider';

const white = 'rgba(255,255,255,0.98)';
const whiteActive = 'hsl(0, 0%, 75%)';
const inactive = 'hsl(190, 50%, 50%)';
const hover = 'hsl(190, 50%, 45%)';
const active = 'hsl(190, 40%, 40%)';
const hoverActive = 'hsl(190, 40%, 35%)';
const inactive2 = 'hsl(160, 50%, 50%)';
const hover2 = 'hsl(160, 50%, 45%)';
const active2 = 'hsl(160, 40%, 40%)';
const hoverActive2 = 'hsl(160, 40%, 35%)';

const SortButtonsStyles = styled.div`
  position: relative;
  z-index: 1;
  min-height: 36px;
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  grid-gap: 20px;
  .toggleGroup {
    display: grid;
    grid-template-columns: 1fr 1fr;
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.5);
  }
  button {
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    height: 100%;
  }
  [value='size'] {
    background: ${inactive};
    color: ${white};
    &:hover {
      background: ${hover};
    }
    &[class*='selected'] {
      color: ${whiteActive};
      background: ${active};
      &:hover {
        background: ${hoverActive};
      }
    }
    &:after {
      display: none;
    }
  }
  [value='colour'] {
    color: ${white};
    background: ${inactive};
    &:hover {
      background: ${hover};
    }
    &[class*='selected'] {
      color: ${whiteActive};
      background: ${active};
      &:hover {
        background: ${hoverActive};
      }
    }
    &:after {
      display: none;
    }
  }
  .btnReset {
    padding: 2px 16px 0 16px;
    span {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-gap: 4px;
    }
    &:not([disabled]) {
      background-color: ${inactive2};
      color: ${white};
      &:hover {
        background-color: ${hover2};
      }
    }
  }
`;

const handleSort = ({
  // event,
  prevSortedParams,
  sortedParams,
  context,
  setSortingColour,
  setSortingSize,
  setSortedParams,
}) => {
  // symmetric difference between arrays
  const difference = (arr1, arr2) => {
    if (!arr1) return arr2;
    if (!arr2) return arr1;
    return arr1
      .filter(x => !arr2.includes(x))
      .concat(arr2.filter(x => !arr1.includes(x)));
  };

  // if sorting colour (sortedParams changed by 'colour'), sort colour
  if (difference(sortedParams, prevSortedParams).includes('colour')) {
    context.sortColour();
    setSortingColour(
      !sortedParams || !sortedParams.includes('colour'),
      prevSortedParams,
    );
    setSortedParams(
      sortedParams.includes('colour')
        ? sortedParams.filter(d => d !== 'colour')
        : [...sortedParams, 'colour'],
    );
  }
  if (difference(sortedParams, prevSortedParams).includes('size')) {
    context.sortSize();
    setSortingSize(
      !sortedParams || !sortedParams.includes('size'),
      prevSortedParams,
    );
    setSortedParams(
      sortedParams.includes('size')
        ? sortedParams.filter(d => d !== 'size')
        : [...sortedParams, 'size'],
    );
  }
  setTimeout(() => {
    setSortingColour(false);
    setSortingSize(false);
  }, 500);
};

const SortPanel = ({ initialExpandedState, setExpanded }) => {
  const [sortingColour, setSortingColour] = useState(false);
  const [sortingSize, setSortingSize] = useState(false);
  const [sortedParams, setSortedParams] = useState([]);

  const context = useContext(ControlsContext);
  return (
    <SortButtonsStyles>
      <ToggleButtonGroup
        className="toggleGroup"
        value={sortedParams}
        onChange={(event, prevSortedParams) =>
          handleSort({
            event,
            prevSortedParams,
            sortedParams,
            context,
            setSortingColour,
            setSortingSize,
            setSortedParams,
          })
        }
      >
        <ToggleButton value="size" disabled={sortingSize}>
          {`Sort${
            sortingSize
              ? 'ing'
              : sortedParams && sortedParams.includes('size')
              ? 'ed'
              : ''
          } by Size`}
        </ToggleButton>
        <ToggleButton value="colour" disabled={sortingColour}>
          {`Sort${
            sortingColour
              ? 'ing'
              : sortedParams && sortedParams.includes('colour')
              ? 'ed'
              : ''
          } by Colour`}
        </ToggleButton>
      </ToggleButtonGroup>
      <Button
        className="btnReset"
        onClick={() => {
          setExpanded(initialExpandedState);
          context.resetFilters();
        }}
        disabled={
          // Disable Reset button if all filters are at 0
          !Object.values(context.state.filters).reduce(
            (tot, curr) => tot + curr,
            0,
          ) > 0
        }
        variant={
          Object.values(context.state.filters).reduce(
            (tot, curr) => tot + curr,
            0,
          ) > 0
            ? 'contained'
            : 'outlined'
        }
      >
        <RestoreIcon /> Reset Filters
      </Button>
    </SortButtonsStyles>
  );
};
export default SortPanel;
