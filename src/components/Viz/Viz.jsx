import React, { Component } from 'react';
import styled from 'styled-components';
import FORCE from '../FORCE';
import Node from './Node';
// import SummaryStatistics from './SummaryStatistics';
import SVG3dEffect from './SVG3dEffect';

const VizStyles = styled.div`
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
class Viz extends Component {
  state = {
    activeNodeId: null,
  };
  componentDidMount() {
    const {
      nodes,
      radiusScale,
      clusterCenters,
      radiusSelector,
      filterQuery,
      onLoadFromSnapshot,
    } = this.props;

    // initialize the force simulation
    FORCE.startSimulation(
      { nodes, radiusScale, clusterCenters, radiusSelector },
      this,
    );

    // if applying a snapshot, handle in ContextProvider
    filterQuery && onLoadFromSnapshot(filterQuery);
  }
  handleClick = nodeId => {
    // apply 3d effect to clicked node
    this.setState({ activeNodeId: nodeId });
  };
  render() {
    const {
      radiusSelector,
      radiusScale,
      nodes,
      onMouseMove,
      onMouseOut,
      onClick,
      isTabletOrLarger,
      // summaryBarsActive,
    } = this.props;
    // const { summaryStatistics, totalNodes } = this.state;

    return (
      <React.Fragment>
        <VizStyles id="graphContainer" style={{ overflow: 'visible' }}>
          <svg id="svg">
            <g id="nodesG">
              {nodes.map(node => {
                return (
                  <Node
                    key={`vizNode_${node.noc}`}
                    onMouseMove={onMouseMove}
                    onMouseOut={onMouseOut}
                    onClick={(event, datum) => {
                      this.handleClick(node.id);
                      if (!isTabletOrLarger) {
                        console.dir(event.target);
                        console.log({ datum });
                        onClick(node);
                      }
                    }}
                    radiusSelector={radiusSelector}
                    radiusScale={radiusScale}
                    data={node}
                    name={node.name}
                    isActive={this.state.activeNodeId === node.id}
                  />
                );
              })}
            </g>

            {/* {totalNodes > nodes.length && summaryBarsActive && (
              <SummaryStatistics
                summaryStatistics={summaryStatistics}
                nodes={nodes}
              />
            )} */}

            <SVG3dEffect />
          </svg>
        </VizStyles>
      </React.Fragment>
    );
  }
}

export default Viz;
