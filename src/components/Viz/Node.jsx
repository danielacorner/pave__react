import * as d3 from 'd3';
import 'jquery/src/jquery';
import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import FORCE from '../FORCE';
const MAX_LINE_LENGTH = 10;
const MAX_TEXT_LENGTH = 30;
const TEXT_LINE_HEIGHT = 6;

const NodeGroupStyles = styled.g`
  overflow: hidden;
  circle {
    &:hover {
      cursor: pointer;
      stroke: rgba(0, 0, 0, 0.9);
      stroke-width: 2;
    }
  }
  .text-label text {
    fill: black;
    font-weight: 600;
    text-anchor: middle;
    font-size: ${TEXT_LINE_HEIGHT}px;
  }
`;

class Node extends Component {
  constructor(props) {
    super(props);
    this.node = createRef();
  }
  componentDidMount() {
    const { radiusScale, radiusSelector, colouredByValue } = this.props;
    this.d3Node = d3
      .select(findDOMNode(this))
      .datum(this.props.data)
      .call(d =>
        FORCE.enterNode({
          selection: d,
          radiusScale,
          radiusSelector,
          colouredByValue,
        }),
      );
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
    if (
      nextProps.isActive !== this.props.isActive ||
      nextProps.isNodeTextVisible !== this.props.isNodeTextVisible
    ) {
      return true;
    } else {
      return false;
    }
  }

  getTextContent = ({ name, isAboveMax }) => {
    let remainingName = name;
    let tspans = [];
    const ellipse = isAboveMax ? '...' : '';
    while (remainingName.length > MAX_LINE_LENGTH) {
      tspans.push(
        remainingName.slice(0, 9) + (remainingName[8] === ' ' ? '' : '-'),
      );
      console.log({ rem9: remainingName[9] });
      remainingName = remainingName.slice(9);
    }
    tspans.push(remainingName + ellipse);
    return tspans;
  };

  render() {
    const { isNodeTextVisible } = this.props;
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
        {isNodeTextVisible && (
          <g className="text-label">
            {this.getTextContent({
              name: this.props.data.name.slice(0, MAX_TEXT_LENGTH),
              isAboveMax: this.props.data.name.length > MAX_TEXT_LENGTH,
            }).map((text, idx) => (
              <text
                dy={
                  idx * TEXT_LINE_HEIGHT -
                  (Math.min(this.props.data.name.length, MAX_TEXT_LENGTH) /
                    MAX_LINE_LENGTH) *
                    (TEXT_LINE_HEIGHT / 4)
                }
                key={text}
              >
                {text}
              </text>
            ))}
          </g>
        )}
      </NodeGroupStyles>
    );
  }
}
export default Node;
