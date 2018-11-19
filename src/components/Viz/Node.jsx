import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import FORCE from '../FORCE';
import 'jquery/src/jquery';
import styled from 'styled-components';
// import $ from 'jqeury/src/jquery';

const NodeGroup = styled.g`
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

export default class Node extends PureComponent {
  componentDidMount() {
    const { radiusScale, radiusSelector } = this.props;

    this.d3Node = d3
      .select(ReactDOM.findDOMNode(this))
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

  render() {
    // console.log('node rendering!');
    return (
      <NodeGroup className="node" id={`node_${this.props.data.id}`}>
        <circle /* onClick={this.props.addLink} */ />
        <text>{this.props.data.name}</text>
      </NodeGroup>
    );
  }
}
