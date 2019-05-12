import { Collapse, IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/lab/Slider';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  FILTER_RANGE,
  FILTER_TITLE,
  SLIDER_WIDTH_LG,
  SLIDER_WIDTH_MD,
  SUBSKILL_FILTER_TITLES,
  SLIDER_TOOLTIP_TEXT,
} from '../../utils/constants';
import { ControlsContext } from '../Context/ContextProvider';

const LabelAndSliderStyles = styled.div`
  background: white;
  font-family: system-ui;
  position: relative;
  .expandLabel {
    margin-left: -6px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    .expand {
      padding: 5px;
      transform: rotate(0deg);
      margin-left: auto;
      transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      &.expandOpen {
        transform: rotate(180deg);
      }
    }
  }
  .collapse {
    position: absolute;
    z-index: 10;
    margin-left: -8px;
    padding: 8px 16px 0 16px;
    background: white;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    box-shadow: 0px 2px 3px 3px rgba(0, 0, 0, 0.1);
    width: ${SLIDER_WIDTH_LG}px;
    @media (max-width: 490px) {
      width: ${SLIDER_WIDTH_MD}px;
    }
    .subskillLabelAndSlider {
      padding-bottom: 8px;
    }
  }
  .minmax {
    height: 0px;
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    font-size: 12px;
    transform: translateY(-5px);
    &.hidden {
      transform: translateY(-10px);
      opacity: 0;
    }
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
`;

const MinMax = ({ visible, title }) => (
  <div className={`minmax${visible === title ? '' : ' hidden'}`}>
    <div>Min</div>
    <div>Max</div>
  </div>
);

const SubskillFilters = ({ filterVar, onMouseUp }) => {
  const subskillFilters = SUBSKILL_FILTER_TITLES(filterVar);
  const context = useContext(ControlsContext);
  const [minMaxVisible, setMinMaxVisible] = useState(false);

  return (
    <div className="subskillFilters">
      {subskillFilters.map(subskill => (
        <div key={subskill.dataLabel} className="subskillLabelAndSlider">
          <Typography id="label">{subskill.title}</Typography>
          <Slider
            className="slider subskillSlider"
            value={context.state.filters[subskill.dataLabel]}
            min={FILTER_RANGE(subskill.dataLabel)[0]}
            max={FILTER_RANGE(subskill.dataLabel)[1]}
            step={1}
            onChange={(event, value) => {
              context.handleFilterChange(subskill.dataLabel, value);
            }}
            onMouseUp={onMouseUp}
            onTouchEnd={onMouseUp}
            onMouseOver={() => setMinMaxVisible(subskill.title)}
            onMouseOut={() => setMinMaxVisible(false)}
          />
          <MinMax visible={minMaxVisible} title={subskill.title} />
        </div>
      ))}
    </div>
  );
};

const FilterSlider = ({
  value,
  filterVar,
  onMouseUp,
  onChange,
  expanded,
  setExpanded,
}) => {
  const [minMaxVisible, setMinMaxVisible] = useState(false);

  const handleChange = (event, value) => {
    onChange(value);
  };

  const subskillSliderProps = {
    filterVar,
    onMouseUp,
  };

  const filterExpanded = expanded[filterVar];

  return (
    <LabelAndSliderStyles className="labelAndSlider">
      <div className="expandLabel">
        <Tooltip title={SLIDER_TOOLTIP_TEXT(filterVar)}>
          <Typography id="label">{FILTER_TITLE(filterVar)}</Typography>
        </Tooltip>
        <Tooltip title={(filterExpanded ? 'Hide' : 'View') + ' Sub-Skills'}>
          <IconButton
            className={`expand expand${filterVar}${
              filterExpanded ? ' expandOpen' : ''
            }`}
            onClick={() =>
              setExpanded({ ...expanded, [filterVar]: !filterExpanded })
            }
            aria-expanded={filterExpanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Slider
        className="slider"
        value={value}
        min={FILTER_RANGE(filterVar)[0]}
        max={FILTER_RANGE(filterVar)[1]}
        step={1}
        onChange={handleChange}
        onMouseUp={onMouseUp}
        onTouchStart={() => setMinMaxVisible(filterVar)}
        onTouchEnd={() => {
          onMouseUp();
          setMinMaxVisible(false);
        }}
        onMouseOver={() => setMinMaxVisible(filterVar)}
        onMouseOut={() => setMinMaxVisible(false)}
      />
      <MinMax visible={minMaxVisible} title={filterVar} />
      <Collapse
        className="collapse"
        in={filterExpanded}
        timeout="auto"
        unmountOnExit
      >
        <SubskillFilters {...subskillSliderProps} />
      </Collapse>
    </LabelAndSliderStyles>
  );
};
export default FilterSlider;
