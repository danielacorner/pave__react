import React, { useState, useRef, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import FORCE from '../FORCE';
import Node from './Node';
import SVG3dEffect from './SVG3dEffect';
import { ControlsContext } from '../Context/ContextProvider';
import YAxis from './YAxis';
import { useMount } from '../../utils/constants';
import GraphViewAxes, { GraphViewAxisTitles } from './GraphViewAxes';
import { activateGraphView, deactivateGraphView } from './graphViewUtils';

const AXIS_HEIGHT = 24;

const VizStyles = styled.div`
  display: grid;
  justify-self: end;
  align-self: end;
  width: 100%;
  height: 100%;
  position: relative;
  .graphViewWrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    transition: all 0.5s cubic-bezier(0.4, -0.49, 0.43, 1.74);
    display: grid;
    justify-self: end;
    align-self: end;
    background: rgba(0, 0, 0, 0.01);
    box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, 0.1) inset;
    &.graphView {
      width: calc(100% - ${AXIS_HEIGHT}px);
      height: calc(100% - ${AXIS_HEIGHT}px);
      transition: all 1s cubic-bezier(0.63, 0, 0.29, 0.99);
    }
  }
  svg {
    width: 100%;
    height: 100%;
    #nodesG {
      transition: transform 0.5s ease-in-out;
      transform: translate(50%, 50%);
    }
    #summaryBar {
      transition: all 0.5s;
    }
    text {
      font-family: roboto light;
    }
  }
`;

// TODO: switch to hooks
interface VizProps {
  onMouseMove(event: Event, datum: any): void;
  onMouseOut(event: any): void;
  onClick(event: Event, node: any): void;
  isTabletOrLarger: boolean;
  isGraphView: boolean;
  axisValues: {
    x: { displayName: string; dataLabel: string };
    y: { displayName: string; dataLabel: string };
  };
  width: number;
  height: number;
  prevPositions: { current: any };
}
const Viz = ({
  onMouseMove,
  onMouseOut,
  onClick,
  isTabletOrLarger,
  isGraphView,
  axisValues,
  width,
  height,
  prevPositions,
}: VizProps) => {
  const [activeNodeId, setActiveNodeId] = useState(null as string | null);
  const vizRef = useRef(null);

  const { state, restartSimulation, getScale } = useContext(ControlsContext);
  const { getRadiusScale, radiusSelector, clusterCenters, nodes } = state;
  const radiusScale = getRadiusScale();

  // CDM, CDU, CWU
  useMount(() => {
    // initialize the force simulation
    (FORCE as any).startSimulation(
      { nodes, radiusScale, clusterCenters, radiusSelector },
      vizRef.current,
    );
  });

  const handleClick = (nodeId: string) => {
    // apply 3d effect to clicked node
    setActiveNodeId(nodeId);
  };

  const MAX_NODES_WITH_TEXT_VISIBLE = 50;
  const isNodeTextVisible = nodes.length < MAX_NODES_WITH_TEXT_VISIBLE;

  // switch to graph view and back
  useEffect(() => {
    if (isGraphView) {
      const scale = getScale();
      activateGraphView({ prevPositions, width, height, axisValues, scale });
    } else {
      if ((FORCE as any).paused) {
        deactivateGraphView({ prevPositions, restartSimulation });
      }
    }
  }, [
    isGraphView,
    width,
    height,
    getScale,
    restartSimulation,
    axisValues,
    prevPositions,
  ]);

  return (
    <VizStyles ref={vizRef} id="graphContainer">
      <div className={`graphViewWrapper${isGraphView ? ` graphView` : ``}`}>
        <svg id="svg">
          <g id="nodesG">
            {nodes.map(node => {
              return (
                <Node
                  radiusScale={radiusScale}
                  key={`vizNode_${node.noc}`}
                  onMouseMove={onMouseMove}
                  onMouseOut={onMouseOut}
                  onClick={(event: Event, datum: any) => {
                    handleClick(node.id);
                    if (!isTabletOrLarger) {
                      onClick(event, node);
                    }
                  }}
                  data={node}
                  isActive={activeNodeId === node.id}
                  isNodeTextVisible={isNodeTextVisible}
                />
              );
            })}
          </g>
          <SVG3dEffect />
        </svg>
        <YAxis />
        <GraphViewAxes {...{ isGraphView, axisValues }} />
      </div>
      <GraphViewAxisTitles {...{ isGraphView, axisValues }} />
    </VizStyles>
  );
};

export default Viz;
