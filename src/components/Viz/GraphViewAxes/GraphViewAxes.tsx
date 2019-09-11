import React, { useEffect, useRef, useState, useContext } from 'react';
import { getAxisTitleMap } from '../../../utils/constants';
import ContainerDimensions from 'react-container-dimensions';
import { ControlsContext } from '../../Context/ContextProvider';
import { AxisStyles, GraphViewAxisTitlesStyles } from './GraphViewAxisStyles';

const NUM_TICKS = 6;

const reScaleAxes = ({ axisValues, nodes, setMargins, setLabels }) => {
  if (!nodes) {
    return null;
  }

  const boundingNodes = { right: null, left: null, top: null, bottom: null };
  // TODO: could get more accurate by doing top-bottom/2, right-left/2 (node centers)
  // get the node, distance, and labels for the most extreme nodes
  document.querySelectorAll('.node').forEach(node => {
    const { top, right, bottom, left } = node.getBoundingClientRect();
    // TODO: abstract
    if (!boundingNodes.top || boundingNodes.top.distance > top) {
      boundingNodes.top = {
        node,
        distance: top,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.right || boundingNodes.right.distance < right) {
      boundingNodes.right = {
        node,
        distance: right,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.bottom || boundingNodes.bottom.distance < bottom) {
      boundingNodes.bottom = {
        node,
        distance: bottom,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
    if (!boundingNodes.left || boundingNodes.left.distance > left) {
      boundingNodes.left = {
        node,
        distance: left,
        axisLabels: {
          x: nodes[+node.id.slice(5) - 1][axisValues.x.dataLabel],
          y: nodes[+node.id.slice(5) - 1][axisValues.y.dataLabel],
        },
      };
    }
  });

  const graphWidth = boundingNodes.right.distance - boundingNodes.left.distance;
  const graphHeight =
    boundingNodes.bottom.distance - boundingNodes.top.distance;

  const newMargins = {
    left: graphWidth / (NUM_TICKS - 1),
    top: graphHeight / (NUM_TICKS - 1),
  };

  const newLabels = {
    x: new Array(NUM_TICKS)
      .fill('')
      .map((d, idx) =>
        (
          (idx / NUM_TICKS) *
            (boundingNodes.right.axisLabels.x -
              boundingNodes.left.axisLabels.x) +
          boundingNodes.left.axisLabels.x
        ).toFixed(1),
      ),
    y: new Array(NUM_TICKS)
      .fill('')
      .map((d, idx) =>
        (
          (-idx / NUM_TICKS) *
            (boundingNodes.top.axisLabels.y -
              boundingNodes.bottom.axisLabels.y) +
          boundingNodes.top.axisLabels.y
        ).toFixed(1),
      ),
  };
  setMargins(newMargins);
  setLabels(newLabels);

  // TODO: set the tick labels
  // TODO: find min/max by axisValues on top/bottom/left/right
  // TODO: calculate & set tick labels
  // TODO: set tick margins based on positions of min/max nodes
};

const EMPTY_TICKS_ARRAY = new Array(NUM_TICKS).fill('');

const Axis = ({ labels, margins, isXAxis }) => (
  <div className={`axis axis${isXAxis ? 'X' : 'Y'}`}>
    {EMPTY_TICKS_ARRAY.map((tick, idx) => (
      // key = idx because ticks won't change?
      <div
        key={idx}
        className="tickAndLabelWrapper"
        style={{
          [isXAxis ? 'marginLeft' : 'marginTop']:
            idx === 0 ? 0 : margins[isXAxis ? 'left' : 'top'],
        }}
      >
        <div className="tick" />
        <div className="label">{labels[isXAxis ? 'x' : 'y'][idx]}</div>
      </div>
    ))}
  </div>
);

const GraphViewAxes = ({ axisValues }) => {
  const {
    state: { nodes },
  } = useContext(ControlsContext);

  const [margins, setMargins] = useState({ left: 0, top: 0 });
  const [labels, setLabels] = useState({
    x: EMPTY_TICKS_ARRAY,
    y: EMPTY_TICKS_ARRAY,
  });
  // update every second based on remaining nodes
  const timerRef = useRef(null as number | null);
  useEffect(() => {
    timerRef.current = window.setInterval(
      () => reScaleAxes({ axisValues, nodes, setMargins, setLabels }),
      1500,
    );
    return () => {
      window.clearInterval(timerRef.current);
    };
  });

  return (
    <>
      <Axis labels={labels} margins={margins} isXAxis={true} />
      <Axis labels={labels} margins={margins} isXAxis={false} />
    </>
  );
};

export default props => (
  <AxisStyles className={!props.isGraphView ? 'hidden' : ''}>
    <ContainerDimensions>
      {({ width, height }) => (
        <GraphViewAxes {...{ width, height, ...props }} />
      )}
    </ContainerDimensions>
  </AxisStyles>
);

export const GraphViewAxisTitles = ({ isGraphView, axisValues }) => {
  const AXIS_TITLE_MAP = getAxisTitleMap();
  return (
    <GraphViewAxisTitlesStyles>
      <div className={`axisTitle axisTitleX${!isGraphView ? ' hidden' : ''}`}>
        {AXIS_TITLE_MAP[axisValues.x.dataLabel]}
      </div>
      <div className={`axisTitle axisTitleY${!isGraphView ? ' hidden' : ''}`}>
        <div className="titleWrapper">
          {AXIS_TITLE_MAP[axisValues.y.dataLabel]}
        </div>
      </div>
    </GraphViewAxisTitlesStyles>
  );
};
