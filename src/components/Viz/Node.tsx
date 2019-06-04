import * as d3 from 'd3';
import 'jquery/src/jquery';
import React, { useRef, useEffect, useContext } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import FORCE from '../FORCE';
import { Selection } from 'd3';
import { ControlsContext } from '../Context/ContextProvider';

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
const getTextContent = (name: string, isAboveMax: boolean) => {
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

interface NodeProps {
  isNodeTextVisible: boolean;
  data: any;
  radiusScale: any;
  onMouseMove(event: any, data: any): void;
  onMouseOut(event: any): void;
  onClick(event?: any, datum?: any): void;
  isActive: boolean;
}
const Node = React.memo(
  ({
    isNodeTextVisible,
    data,
    onMouseMove,
    onMouseOut,
    onClick,
    isActive,
    radiusScale,
  }: NodeProps) => {
    const node = useRef(null as any);
    const d3Node = useRef(null as any);
    const { state } = useContext(ControlsContext);
    const { colouredByValue, radiusSelector } = state;

    useEffect(() => {
      d3Node.current = d3
        .select(findDOMNode(node.current) as any)
        .datum(data)
        .call((d: Selection<SVGGElement, any, null, undefined>) =>
          (FORCE as any).enterNode({
            selection: d,
            radiusScale,
            radiusSelector,
            colouredByValue,
          }),
        );
    }, []);

    useEffect(() => {
      d3Node.current.datum(data).call((FORCE as any).updateNode);
    });

    // componentWillUnmount() {
    //   // TODO: check for event listeners to garbage-collect
    //   // FORCE.removeDrag();
    //   // console.log('node unmounting!');
    //   // document
    //   //   .querySelector(`#node_${data.id} circle`)
    //   //   .removeEventListener('click');
    //   // console.log(`node_${data.id} unmounting!`);
    //   // remove all event listeners
    //   // window.$(`#node_${data.id}`).off();
    //   // if that doesn't work, try
    //   // window
    //   //   .$(`#node_${data.id}`)
    //   //   .replaceWith(window.$(`#node_${data.id}`).clone());
    // }
    // shouldComponentUpdate(nextProps: NodeProps) {
    //   //TODO: determine when component should update
    //   if (
    //     nextProps.isActive !== isActive ||
    //     nextProps.isNodeTextVisible !== isNodeTextVisible
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

    // console.count('node rendering!');
    return (
      <NodeGroupStyles ref={node} className="node" id={`node_${data.id}`}>
        <circle
          onMouseMove={event => onMouseMove(event, data)}
          onMouseOut={onMouseOut}
          onClick={onClick}
          /* onClick={addLink} */
          filter={isActive ? 'url(#virtual_light)' : ''}
        />
        {isNodeTextVisible && (
          <g className="text-label">
            {getTextContent(
              data.name.slice(0, MAX_TEXT_LENGTH),
              data.name.length > MAX_TEXT_LENGTH,
            ).map((text, idx) => (
              <text
                dy={
                  idx * TEXT_LINE_HEIGHT -
                  (Math.min(data.name.length, MAX_TEXT_LENGTH) /
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
  },
);
export default Node;
