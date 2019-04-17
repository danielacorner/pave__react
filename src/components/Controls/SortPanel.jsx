import { Button } from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/RestoreRounded';
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
  .sortBtnGroup {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 6px;
  }
  button {
    border-radius: 4px;
    transition: all 0.1s ease-in-out;
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
  sortBy,
  sortedParams,
  context,
  setSortingColour,
  setSortingSize,
  setSortedParams,
}) => {
  if (sortBy === 'size') {
    context.sortSize();
    if (!sortedParams.includes('size')) {
      setSortingSize(true);
      setSortedParams([...sortedParams, 'size']);
    } else {
      setSortedParams(sortedParams.filter(d => d !== 'size'));
    }
  }
  if (sortBy === 'colour') {
    context.sortColour();
    if (!sortedParams.includes('colour')) {
      setSortingColour(true);
      setSortedParams([...sortedParams, 'colour']);
    } else {
      setSortedParams(sortedParams.filter(d => d !== 'colour'));
    }
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
      <div className="sortBtnGroup">
        <Button
          onClick={() => {
            handleSort({
              sortBy: 'size',
              sortedParams,
              context,
              setSortingColour,
              setSortingSize,
              setSortedParams,
            });
          }}
          variant="outlined"
          value="size"
          disabled={sortingSize}
        >
          {`Sort${
            sortingSize
              ? 'ing'
              : sortedParams && sortedParams.includes('size')
              ? 'ed'
              : ''
          } by Size`}
        </Button>
        <Button
          onClick={() =>
            handleSort({
              sortBy: 'colour',
              sortedParams,
              context,
              setSortingColour,
              setSortingSize,
              setSortedParams,
            })
          }
          variant="outlined"
          value="colour"
          disabled={sortingColour}
        >
          {`Sort${
            sortingColour
              ? 'ing'
              : sortedParams && sortedParams.includes('colour')
              ? 'ed'
              : ''
          } by Colour`}
        </Button>
      </div>
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
        variant="outlined"
      >
        <RestoreIcon /> Reset Filters
      </Button>
    </SortButtonsStyles>
  );
};
export default SortPanel;
