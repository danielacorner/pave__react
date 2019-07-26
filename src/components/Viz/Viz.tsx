import React, { useState, useRef, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import FORCE from '../FORCE';
import Node from './Node';
import SVG3dEffect from './SVG3dEffect';
import { ControlsContext } from '../Context/ContextProvider';
import YAxis from './YAxis';
import { useMount } from '../../utils/constants';
import * as d3 from 'd3';
import { useWindowSize } from '../useWindowSize';
import GraphViewAxes, { getGraphViewPositions } from './GraphViewAxes';

const VizStyles = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: grid;
  justify-self: center;
  align-self: center;
  background: rgba(0, 0, 0, 0.01);
  box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, 0.1) inset;
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

  const { innerWidth, innerHeight } = useWindowSize();

  const prevPositions = useRef({});
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
  }, [isGraphView, innerHeight, innerWidth, restartSimulation, axisValues]);

  return (
    <VizStyles ref={vizRef} id="graphContainer">
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
    </VizStyles>
  );
};

export default Viz;

type ActivateGraphViewProps = {
  prevPositions: React.MutableRefObject<{}>;
  width: number;
  height: number;
  axisValues: {
    x: { displayName: string; dataLabel: string };
    y: { displayName: string; dataLabel: string };
  };
  scale: number;
};

function activateGraphView({
  prevPositions,
  width,
  height,
  axisValues,
  scale,
}: ActivateGraphViewProps) {
  (FORCE as any).stopSimulation(true);
  setTimeout(() => {
    d3.selectAll('.node')
      .transition()
      .ease(d3.easeCubicInOut)
      .delay((d, i) => i * 0.3)
      .duration(700)
      .attr('transform', function(d: any) {
        // preserve previous positions to return to
        prevPositions.current[d.job] = d3.select(this).attr('transform');
        const { x, y } = getGraphViewPositions({
          d,
          width,
          height,
          axisValues,
        });
        return `translate(${(x / scale) * 0.7},${y * 0.8})`;
      });
  }, 0);
}

type DeactivateGraphViewProps = {
  prevPositions: React.MutableRefObject<{}>;
  restartSimulation: any;
};
function deactivateGraphView({
  prevPositions,
  restartSimulation,
}: DeactivateGraphViewProps) {
  d3.selectAll('.node')
    .transition()
    .ease(d3.easeBackInOut)
    .delay((d, i) => i * 0.3)
    .duration(500)
    .attr('transform', (d: any) => {
      return prevPositions.current[d.job];
    });
  setTimeout(() => {
    restartSimulation();
  }, 400);
}
