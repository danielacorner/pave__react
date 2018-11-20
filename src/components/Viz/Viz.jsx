import React, { PureComponent } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainerStyles';

class Viz extends PureComponent {
  componentDidMount() {
    const { nodes, radiusScale, clusterCenters, radiusSelector } = this.props;
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

  // componentDidUpdate(prevProps, prevState) {
  // stop (improves performance), then restart the simulation
  // FORCE.stopSimulation();
  // restartSimulation(this.props, this);
  // if (prevProps.nodes !== this.props.nodes) {
  //   // if it's not paused, restart the simulation with the new filtered nodes
  //   if (!FORCE.paused) {
  //     restartSimulation(this.props, this);
  //   }
  // }
  // }

  // todo: these functions moved somewhere else?
  // handleAddNode = e => {
  //   this.setState({ [e.target.name]: e.target.value });
  // };

  // addNode = e => {
  //   e.preventDefault();
  //   this.setState(prevState => ({
  //     nodes: [
  //       ...prevState.nodes,
  //       { name: this.state.name, id: prevState.nodes.length + 1 },
  //     ],
  //     name: '',
  //   }));
  // };
}

export default Viz;
