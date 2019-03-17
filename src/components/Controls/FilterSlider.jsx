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
} from '../../utils/constants';
import { ControlsContext } from '../Context/ContextProvider';

const LabelAndSliderStyles = styled.div`
  position: relative;
  .expandLabel {
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
    z-index: 2;
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
`;

const SubskillFilters = ({ filterVar, onMouseUp }) => {
  const subskillFilters = SUBSKILL_FILTER_TITLES(filterVar);
  const context = useContext(ControlsContext);

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
          />
        </div>
      ))}
    </div>
  );
};

const FilterSlider = ({ value, filterVar, onMouseUp, onChange }) => {
  const handleChange = (event, value) => {
    onChange(value);
  };

  const [expanded, setExpanded] = useState(false);

  const subskillSliderProps = {
    filterVar,
    onMouseUp,
  };

  return (
    <LabelAndSliderStyles className="labelAndSlider">
      <div className="expandLabel">
        <Typography id="label">{FILTER_TITLE(filterVar)}</Typography>
        <Tooltip title={(expanded ? 'Hide' : 'View') + ' Sub-Skills'}>
          <IconButton
            className={`expand${expanded ? ' expandOpen' : ''}`}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
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
        onTouchEnd={onMouseUp}
      />
      <Collapse className="collapse" in={expanded} timeout="auto" unmountOnExit>
        <SubskillFilters {...subskillSliderProps} />
      </Collapse>
    </LabelAndSliderStyles>
  );
};
export default FilterSlider;
