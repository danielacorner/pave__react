import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import FORCE from '../FORCE';
import 'jquery/src/jquery';
import NodeGroup from '../styles/NodeStyles';

class Node extends PureComponent {
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
        <circle
          onMouseEnter={event => this.props.onMouseOver(event, this.props.data)}
          onMouseOut={this.props.onMouseOut}
          onClick={this.props.onClick}
          /* onClick={this.props.addLink} */
          filter={this.props.isActive ? 'url(#virtual_light)' : null}
        />
        <text>{this.props.data.name}</text>
      </NodeGroup>
    );
  }
}
export default Node;
