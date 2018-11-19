import React, { PureComponent } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainer';

const restartSimulation = (
  { nodes, radiusScale, clusterCenters, radiusSelector },
  that,
) => {
  FORCE.initForce({
    nodes,
    radiusScale,
    radiusSelector,
    clusterCenters,
  });
  FORCE.tick(that);
  FORCE.drag();
};

class Viz extends PureComponent {
  state = {};

  componentDidMount() {
    restartSimulation(this.props, this);
    // if applying a snapshot, handle in ContextProvider
    this.props.filterState &&
      this.props.onLoadFromSnapshot(this.props.filterState);
  }

  componentDidUpdate(prevProps, prevState) {
    // stop (improves performance), then restart the simulation
    FORCE.stopSimulation();
    restartSimulation(this.props, this);

    if (prevProps.nodes !== this.props.nodes) {
      // if it's not paused, restart the simulation with the new filtered nodes
      if (!FORCE.paused) {
        restartSimulation(this.props, this);
      }
    }
  }

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

  render() {
    // console.log('this.props.nodes', this.props.nodes);
    const { radiusSelector, radiusScale } = this.props;
    // const nodes = ;
    return (
      <GraphContainer id="graphContainer" style={{ overflow: 'visible' }}>
        <svg id="svg">
          <g id="nodesG">
            {this.props.nodes.map(node => {
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
