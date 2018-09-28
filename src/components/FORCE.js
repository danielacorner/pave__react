import * as d3 from 'd3';
import ReactDOM from 'react-dom';

const FORCE = function(nsp) {
  const width = window.innerWidth,
    height = window.innerHeight,
    color = d3.scaleOrdinal(d3.schemeCategory10),
    initForce = nodes => {
      nsp.force = d3
        .forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-30))
        // .force(
        //   'center',
        //   d3
        //     .forceCenter()
        //     .x(0)
        //     .y(0)
        // )
        .force('x', d3.forceX())
        .force('y', d3.forceY());
    },
    enterNode = selection => {
      const circle = selection
        .select('circle')
        .attr('r', d => d.equalRadius)
        .style('fill', 'tomato')
        .style('stroke', 'bisque')
        .style('stroke-width', '3px')
        .style('transform', `translate(${width / 2},${height / 2})`);

      // text labels
      selection
        .select('text')
        .attr('id', d => `text_${d.id}`)
        .style('fill', 'honeydew')
        .style('font-weight', '600')
        .style('text-transform', 'uppercase')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'middle')
        .style('font-size', '10px')
        .style('font-family', 'cursive')
        .style('display', 'none');
    },
    updateNode = selection => {
      selection
        .attr(
          'transform',
          d => 'translate(' + (d.x + width / 2) + ',' + (d.y + height / 2) + ')'
        )
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    },
    updateGraph = selection => {
      selection.selectAll('.node').call(updateNode);
    },
    dragStarted = d => {
      if (!d3.event.active) nsp.force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    dragging = d => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    dragEnded = d => {
      if (!d3.event.active) nsp.force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    },
    drag = () =>
      d3.selectAll('g.node').call(
        d3
          .drag()
          .on('start', dragStarted)
          .on('drag', dragging)
          .on('end', dragEnded)
      ),
    tick = that => {
      that.d3Graph = d3.select(ReactDOM.findDOMNode(that));
      nsp.force.on('tick', () => {
        that.d3Graph.call(updateGraph);
      });
    };

  nsp.width = window.innerWidth;
  nsp.height = window.innerHeight;
  nsp.enterNode = enterNode;
  nsp.updateNode = updateNode;
  // nsp.enterLink = enterLink;
  // nsp.updateLink = updateLink;
  nsp.updateGraph = updateGraph;
  nsp.initForce = initForce;
  nsp.dragStarted = dragStarted;
  nsp.dragging = dragging;
  nsp.dragEnded = dragEnded;
  nsp.drag = drag;
  nsp.tick = tick;

  return nsp;
};
FORCE(FORCE || {});

export default FORCE;
