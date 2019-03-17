import * as d3 from 'd3';
import 'jquery/src/jquery';
import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import FORCE from '../FORCE';

const NodeGroupStyles = styled.g`
  circle {
    &:hover {
      cursor: pointer;
      stroke: rgba(0, 0, 0, 0.9);
      stroke-width: 2;
    }
  }
  .text-label {
    fill: honeydew;
    font-weight: 600;
    text-transform: uppercase;
    text-anchor: middle;
    alignment-baseline: middle;
    font-size: 10px;
    font-family: cursive;
  }
`;

class Node extends Component {
  constructor(props) {
    super(props);
    this.node = createRef();
  }
  componentDidMount() {
    const { radiusScale, radiusSelector } = this.props;

    this.d3Node = d3
      .select(findDOMNode(this))
      .datum(this.props.data)
      .call(d => FORCE.enterNode(d, radiusScale, radiusSelector));
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data).call(FORCE.updateNode);
  }

  componentWillUnmount() {
    // TODO: check for event listeners to garbage-collect
    // FORCE.removeDrag();
    // console.log('node unmounting!');
    // document
    //   .querySelector(`#node_${this.props.data.id} circle`)
    //   .removeEventListener('click');
    // console.log(`node_${this.props.data.id} unmounting!`);
    // remove all event listeners
    // window.$(`#node_${this.props.data.id}`).off();
    // if that doesn't work, try
    // window
    //   .$(`#node_${this.props.data.id}`)
    //   .replaceWith(window.$(`#node_${this.props.data.id}`).clone());
  }
  shouldComponentUpdate(nextProps, nextState) {
    //TODO: determine when component should update
    if (nextProps.isActive !== this.props.isActive) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    // console.count('node rendering!');
    return (
      <NodeGroupStyles
        ref={node => (this.node = node)}
        className="node"
        id={`node_${this.props.data.id}`}
      >
        <circle
          onMouseMove={event => this.props.onMouseMove(event, this.props.data)}
          onMouseOut={this.props.onMouseOut}
          onClick={this.props.onClick}
          /* onClick={this.props.addLink} */
          filter={this.props.isActive ? 'url(#virtual_light)' : null}
        />
        <text>{this.props.data.name}</text>
      </NodeGroupStyles>
    );
  }
}
export default Node;
