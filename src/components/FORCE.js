import * as d3 from 'd3';
import ReactDOM from 'react-dom';

const FORCE = function(nsp) {
  const width = window.innerWidth,
    height = window.innerHeight,
    color = d3.scaleOrdinal(d3.schemeCategory10),
    cluster = (nodes, clusterCenters) => {
      let strength = 0.2;

      function force(alpha) {
        // scale + curve alpha value
        alpha *= strength * alpha;

        nodes.forEach(function(d) {
          var cluster = clusterCenters[d.cluster];
          if (cluster === d) return;

          let x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;

          if (l !== r) {
            l = ((l - r) / l) * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
          }
        });
      }

      force.initialize = function(_) {
        nodes = _;
      };

      force.strength = _ => {
        strength = _ == null ? strength : _;
        return force;
      };

      return force;
    },
    initForce = ({ nodes, radiusScale, radiusSelector, clusterCenters }) => {
      // console.log({ clusterCenters });
      nsp.force = d3
        .forceSimulation(nodes)
        .force(
          'charge',
          d3.forceManyBody().strength(d => {
            // console.log(d[radiusSelector]);
            return -Math.pow(radiusScale(d[radiusSelector]), 1.6); // todo: calculate this magic number
          })
        )
        .force('x', d3.forceX().strength(0.1))
        .force('y', d3.forceY().strength(0.1));
      // .force('cluster', cluster(nodes, clusterCenters).strength(0.2));
    },
    enterNode = (selection, radiusScale, radiusSelector) => {
      // circles
      selection
        .select('circle')
        .attr('r', d => radiusScale(d[radiusSelector]))
        // .attr('r', d => 10)
        .style('fill', d => color(d.cluster))
        .style('stroke', '#272727')
        .style('stroke-width', 0)
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
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
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
