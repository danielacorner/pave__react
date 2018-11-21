import React, { PureComponent } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainerStyles';
import SVG3dEffect from './SVG3dEffect';

class Viz extends PureComponent {
  state = { activeNodeId: null };
  componentDidMount() {
    const { nodes, radiusScale, clusterCenters, radiusSelector } = this.props;
    // initialize the force simulation
    FORCE.startSimulation(
      { nodes, radiusScale, clusterCenters, radiusSelector },
      this,
    );
    // if applying a snapshot, handle in ContextProvider
    this.props.filterQuery &&
      this.props.onLoadFromSnapshot(this.props.filterQuery);
  }
  handleClick = nodeId => {
    // apply 3d effect to clicked node
    this.setState({ activeNodeId: nodeId });
  };
  render() {
    const { radiusSelector, radiusScale, nodes } = this.props;
    return (
      <GraphContainer id="graphContainer" style={{ overflow: 'visible' }}>
        <svg id="svg">
          <g id="nodesG">
            {nodes.map(node => {
              return (
                <Node
                  onClick={() => {
                    this.handleClick(node.id);
                  }}
                  radiusSelector={radiusSelector}
                  radiusScale={radiusScale}
                  data={node}
                  name={node.name}
                  key={`vizNode_${node.id}`}
                  isActive={this.state.activeNodeId === node.id}
                />
              );
            })}
          </g>

          <SVG3dEffect />
        </svg>
      </GraphContainer>
    );
  }
}

export default Viz;
