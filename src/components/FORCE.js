import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import APP_CONFIG from '../app.config';

const FORCE = function(nsp) {
  let radiusScale;

  const width = window.innerWidth,
    height = window.innerHeight,
    color = d3.scaleOrdinal(d3.schemeCategory10),
    clusterCenters = nsp.clusterCenters || [],
    clusterSelector = 'industry',
    radiusSelector = 'workers',
    forceCluster = (nodes, clusterCenters) => {
      // These are implementations of the custom forces.
      console.log(clusterCenters);
      alpha => {
        nodes.forEach(d => {
          if (d.id === 1) {
            console.log(d);
          }
          const clusterCenter = clusterCenters[d.cluster];
          if (clusterCenter === d) {
            return;
          }
          let x = d.x - clusterCenter.x,
            y = d.y - clusterCenter.y,
            l = APP_CONFIG.FORCES.CLUSTER * Math.sqrt(x * x + y * y);
          const r = d[radiusSelector] + clusterCenter[radiusSelector];
          if (l !== r) {
            l = ((l - r) / l) * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            clusterCenter.x += x;
            clusterCenter.y += y;
          }
        });
      };
    },
    initForce = (nodes, radiusScale) => {
      const uniqueClusterValues = nodes
        .map(d => d[clusterSelector])
        .filter((value, index, self) => self.indexOf(value) === index);

      nodes = nodes.map(d => {
        // scale radius to fit on the screen
        // SELECT THE CLUSTER VARIABLE 2/2
        const cluster = uniqueClusterValues.indexOf(d[clusterSelector]) + 1;
        // add to clusters array if it doesn't exist or the radius is larger than any other radius in the cluster
        if (
          !clusterCenters[cluster] ||
          d[radiusSelector] > clusterCenters[cluster][radiusSelector]
        ) {
          clusterCenters[cluster] = d;
          // todo: emit new cluster centers
          // this._statusService.changeClusterCenters(clusterCenters);
        }
        if ([1, 100, 200, 300, 400].includes(d.id)) {
        }
        return d;
      });

      nsp.force = d3
        .forceSimulation(nodes)
        .force(
          'charge',
          d3.forceManyBody().strength(d => {
            return -Math.pow(radiusScale(d[radiusSelector]), 1.6); // todo: calculate this magic number
          })
        )
        // .force(
        //   'center',
        //   d3
        //     .forceCenter()
        //     .x(0)
        //     .y(0)
        // )
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .force('cluster', forceCluster(nodes, clusterCenters));
    },
    enterNode = (selection, radiusScale) => {
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

  nsp.clusterCenters = clusterCenters;

  return nsp;
};
FORCE(FORCE || {});

export default FORCE;
