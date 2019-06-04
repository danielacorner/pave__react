import * as d3 from 'd3';
import 'jquery/src/jquery';
import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import FORCE from '../FORCE';
import { Selection } from 'd3';
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
  .text-label {
    pointer-events: none;
  }
  .text-label text {
    fill: black;
    font-weight: 600;
    text-anchor: middle;
    font-size: ${TEXT_LINE_HEIGHT}px;
  }
`;
interface NodeProps {
  isNodeTextVisible: boolean;
  data: any;
  radiusScale: any;
  radiusSelector: string;
  colouredByValue: string | null;
  onMouseMove(event: any, data: any): void;
  onMouseOut(event: any): void;
  onClick(event?: any, datum?: any): void;
  isActive: boolean;
  name: string;
}
class Node extends Component<NodeProps> {
  node = null as any;
  d3Node = null as any;

  constructor(props: NodeProps) {
    super(props);
    this.node = createRef();
  }
  componentDidMount() {
    const { radiusScale, radiusSelector, colouredByValue } = this.props;
    this.d3Node = d3
      .select(findDOMNode(this) as SVGGElement)
      .datum(this.props.data)
      .call((d: Selection<SVGGElement, any, null, undefined>) =>
        (FORCE as any).enterNode({
          selection: d,
          radiusScale,
          radiusSelector,
          colouredByValue,
        }),
      );
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data).call((FORCE as any).updateNode);
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
  shouldComponentUpdate(nextProps: NodeProps) {
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

  getTextContent = (name: string, isAboveMax: boolean) => {
    let remainingName = name;
    let tspans = [];
    const ellipse = isAboveMax ? '...' : '';
    while (remainingName.length > MAX_LINE_LENGTH) {
      tspans.push(
        remainingName.slice(0, 9) + (remainingName[8] === ' ' ? '' : '-'),
      );
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
        ref={(node: any) => (this.node = node)}
        className="node"
        id={`node_${this.props.data.id}`}
      >
        <circle
          onMouseMove={event => this.props.onMouseMove(event, this.props.data)}
          onMouseOut={this.props.onMouseOut}
          onClick={this.props.onClick}
          /* onClick={this.props.addLink} */
          filter={this.props.isActive ? 'url(#virtual_light)' : ''}
        />
        {isNodeTextVisible && (
          <g className="text-label">
            {this.getTextContent(
              this.props.data.name.slice(0, MAX_TEXT_LENGTH),
              this.props.data.name.length > MAX_TEXT_LENGTH,
            ).map((text, idx) => (
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
