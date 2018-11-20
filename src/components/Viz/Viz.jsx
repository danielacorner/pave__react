import React, { PureComponent } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainerStyles';

class Viz extends PureComponent {
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
  render() {
    const { radiusSelector, radiusScale, nodes } = this.props;
    return (
      <GraphContainer id="graphContainer" style={{ overflow: 'visible' }}>
        <svg id="svg">
          <g id="nodesG">
            {nodes.map(node => {
              return (
                <Node
                  radiusSelector={radiusSelector}
                  radiusScale={radiusScale}
                  data={node}
                  name={node.name}
                  key={`vizNode_${node.id}`}
                />
              );
            })}
          </g>
        </svg>
      </GraphContainer>
    );
  }
}

export default Viz;
