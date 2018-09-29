import React, { Component } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import styled from 'styled-components';

const GraphContainer = styled.div`
  width: 95%;
  margin: auto;
  height: 100%;
  display: grid;
  place-items: center center;
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
      addLinkArray: [],
      name: '',
      nodes: props.data.map(d => {
        d.name = d.job;
        return d;
      }),
      hasResizedOnce: false
    };
    this.handleAddNode = this.handleAddNode.bind(this);
    this.addNode = this.addNode.bind(this);
  }

  componentDidMount() {
    const data = this.state;
    FORCE.initForce(data.nodes /* , data.links */);
    FORCE.tick(this);
    FORCE.drag();
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nodes !== this.state.nodes) {
      const data = this.state;
      FORCE.initForce(data.nodes /* , data.links */);
      FORCE.tick(this);
      FORCE.drag();
    }
  }

  handleResize = () => {
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
    const nodes = this.state.nodes.map(node => {
      return <Node data={node} name={node.name} key={node.id} />;
    });
    return (
      <GraphContainer id="graphContainer">
        <svg id="svg">
          <g id="nodesG">{nodes}</g>
        </svg>
      </GraphContainer>
    );
  }
}
