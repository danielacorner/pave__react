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
      /* transform: translate(50%, 50%); */
    }
  }
`;

export default class Viz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasResizedOnce: false
    };
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
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

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

      this.handleResize();
    }
  }

  handleResize = () => {
    console.log('resizing');

    const graphContainer = document.getElementById('graphContainer');
    const svg = document.getElementById('svg');
    const svgWidth = svg.getBoundingClientRect().width;
    const nodesG = document.getElementById('nodesG');
    const graphBB = graphContainer.getBoundingClientRect();
    const vizHeight = graphBB.height;

    // translate the nodes group into the middle
    nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight / 2}px)`;

    // resize the graph container to fit the screen
    const getScaleRatio = () => {
      // if constrained, shrink!
      const minLength = Math.min(vizHeight, svgWidth);
      const nodesWidth = nodesG.getBBox().width;
      return minLength < nodesWidth ? minLength / nodesWidth : 1;
    };

    // if it's the first resize, let the nodes stabilize first
    if (!this.state.hasResizedOnce) {
      setTimeout(() => {
        nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight /
          2}px) scale(${getScaleRatio()})`;
      }, 1000);
    } else {
      nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight /
        2}px) scale(${getScaleRatio()})`;
    }

    !this.state.hasResizedOnce && this.setState({ hasResizedOnce: true });
  };

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
      <GraphContainer id="graphContainer">
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
