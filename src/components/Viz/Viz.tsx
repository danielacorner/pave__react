import React, { useState, useRef, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import FORCE, { STUDY_AVG } from '../FORCE';
import Node from './Node';
import SVG3dEffect from './SVG3dEffect';
import { ControlsContext } from '../Context/ContextProvider';
import YAxis from './YAxis';
import { useMount } from '../../utils/constants';
import * as d3 from 'd3';
import { useWindowSize } from '../useWindowSize';
import GraphViewAxes from './GraphViewAxes';

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
}
const Viz = ({
  onMouseMove,
  onMouseOut,
  onClick,
  isTabletOrLarger,
  isGraphView,
}: VizProps) => {
  const [activeNodeId, setActiveNodeId] = useState(null as string | null);
  const vizRef = useRef(null);

  const { state } = useContext(ControlsContext);
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

  // switch to graph view and back
  useEffect(() => {
    if (isGraphView) {
      (FORCE as any).stopSimulation();
      setTimeout(() => {
        d3.selectAll('.node')
          .transition()
          .ease(d3.easeCubicInOut)
          .delay((d, i) => i * 0.3)
          .duration(700)
          .attr('transform', (d: any) => {
            return `translate(${innerWidth * d.automationRisk -
              innerWidth / 2},${(innerHeight * d.yearsStudy) / STUDY_AVG -
              innerHeight / 2})`;
          });
      }, 0);
    }
  }, [isGraphView]);

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
      <GraphViewAxes {...{ isGraphView }} />
    </VizStyles>
  );
};

export default Viz;
