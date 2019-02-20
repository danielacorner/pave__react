import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React, { useContext, useState } from 'react';
import { ControlsContext } from './Context/ContextProvider';
import SortButtonsGrid from './styles/SortButtonsGrid';

const handleSort = ({
  event,
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

const SortPanel = () => {
  const [sortingColour, setSortingColour] = useState(false);
  const [sortingSize, setSortingSize] = useState(false);
  const [sortedParams, setSortedParams] = useState([]);

  const context = useContext(ControlsContext);
  return (
    <SortButtonsGrid>
      <ToggleButtonGroup
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
    </SortButtonsGrid>
  );
};
export default SortPanel;
