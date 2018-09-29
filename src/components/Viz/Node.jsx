import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import FORCE from '../FORCE';

export default class Node extends Component {
  componentDidMount() {
    this.d3Node = d3
      .select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(d => FORCE.enterNode(d, this.props.radiusScale));
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data).call(FORCE.updateNode);
  }

  render() {
    return (
      <g className="node">
        <circle onClick={this.props.addLink} />
        <text>{this.props.data.name}</text>
      </g>
    );
  }
}
