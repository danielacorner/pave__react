import React, { Component } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import styled from 'styled-components';

const GraphContainer = styled.div`
  width: 95%;
  height: 100%;
  display: grid;
  place-self: center center;
  svg {
    background-color: steelblue;
    width: 100%;
    height: 100%;
    #nodesG {
      transition: transform 0.5s ease-in-out;
      /* transform: translate(50%, 50%); */
    }
  }
`;

export default class Viz extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAddNode = this.handleAddNode.bind(this);
    this.addNode = this.addNode.bind(this);
  }

  componentDidMount() {
    // const data = this.state;
    const { radiusScale, clusterCenters, radiusSelector } = this.props;

    FORCE.initForce({
      nodes: this.props.nodes,
      radiusScale: radiusScale,
      radiusSelector: radiusSelector,
      clusterCenters: clusterCenters
    });
    FORCE.tick(this);
    FORCE.drag();

    // if applying a snapshot, handle in ContextProvider
    this.props.filterState &&
      this.props.onLoadFromSnapshot(this.props.filterState);
  }

  componentWillUnmount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.nodes !== this.props.nodes) {
      // const data = this.state;
      const { radiusScale, clusterCenters, radiusSelector } = this.props;

      if (!FORCE.paused) {
        FORCE.initForce({
          nodes: this.props.nodes,
          radiusScale: radiusScale,
          radiusSelector: radiusSelector,
          clusterCenters: clusterCenters
        });
        FORCE.tick(this);
        FORCE.drag();
      }
    }
  }

  handleAddNode(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addNode(e) {
    e.preventDefault();
    this.setState(prevState => ({
      nodes: [
        ...prevState.nodes,
        { name: this.state.name, id: prevState.nodes.length + 1 }
      ],
      name: ''
    }));
  }

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
