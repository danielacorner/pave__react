import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { $ } from './Context/ContextProvider';
import { WORKERS, INDUSTRY } from './Controls/SortPanel';

const lightGrey = 'hsl(0,0%,80%)';
const color = d3.scaleOrdinal(d3.schemeCategory10);
export const getCircleColour = ({ d, colouredByValue }) => {
  switch (colouredByValue) {
    case 'automationRisk':
      return d3.interpolateRdYlGn(1 - d.automationRisk);
    case 'salary':
      return d3.interpolateGreens(d.salaryMed / 60);
    case 'study':
      return d3.interpolateBlues(d.yearsStudy / 5);
    case INDUSTRY:
      return color(d.cluster);
    default:
      return lightGrey;
  }
};

const FORCE = function(nsp) {
  let paused,
    updatePositionsInterval,
    removeLabelsTimeout,
    positionX,
    positionY,
    sortedTypeX,
    sortedTypeY;
  const // optional: constrain nodes within a bounding box
    nodeTransform = d => {
      // const minLength = Math.min(width, height) * 0.75;
      // const constrainedX = Math.min(Math.max(d.x, -minLength), minLength);
      // const constrainedY = Math.min(Math.max(d.y, -minLength), minLength);
      // return 'translate(' + constrainedX + ',' + constrainedY + ')';
      return `translate(${d.x},${d.y})`;
    },
    // force parameters
    CLUSTER_PADDING = 30,
    CENTER_GRAVITY = 0.75,
    COLLIDE_STRENGTH = 0.5,
    FRICTION = 0.7,
    START_SPEED = 0.6,
    RESTART_SPEED = 0.3,
    START_FRICTION = 0.01,
    END_SPEED = 0,
    // color scale
    // cluster force implementation
    cluster = (nodes, radiusScale, radiusSelector, clusterCenters) => {
      // default strength if unspecified
      let strength = 0.1;

      function forceCluster(alpha) {
        // scale + curve alpha value
        alpha *= strength * alpha;

        nodes.forEach(d => {
          let cluster = clusterCenters[d.cluster];
          if (cluster === d) return;

          let x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = 1 * Math.sqrt(x * x + y * y),
            r =
              radiusScale(d[radiusSelector]) +
              radiusScale(cluster[radiusSelector]);

          if (l !== r) {
            l = ((l - r) / l) * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
          }
        });
      }

      forceCluster.initialize = function(_) {
        nodes = _;
      };

      forceCluster.strength = _ => {
        strength = _ == null ? strength : _;
        return forceCluster;
      };

      return forceCluster;
    },
    initForce = ({ nodes, radiusScale, radiusSelector, clusterCenters }) => {
      nsp.force = d3
        .forceSimulation(nodes)
        // collision force prevents node overlap
        .force(
          'collide',
          d3
            .forceCollide(d => radiusScale(d[radiusSelector]))
            .strength(COLLIDE_STRENGTH),
        )
        // charge/repellent force helps nodes equilibrate into clusters by reducing FRICTION
        .force(
          'charge',
          d3.forceManyBody().strength(d => {
            return (
              -Math.pow(radiusScale(d[radiusSelector]), 2) - CLUSTER_PADDING
            ); // todo: calculate this magic number
          }),
        )
        // optional center force re-centers the viewport around the nodes
        // .force('center', d3.forceCenter([width / 2, height / 2]))
        // forces that push nodes to the center
        .force('x', d3.forceX().strength(CENTER_GRAVITY))
        .force('y', d3.forceY().strength(CENTER_GRAVITY))
        // cluster force attracts nodes to their cluster center nodes
        .force(
          'cluster',
          cluster(nodes, radiusScale, radiusSelector, clusterCenters).strength(
            1,
          ),
        )
        .velocityDecay(FRICTION)
        .alpha(START_SPEED)
        .alphaDecay(START_FRICTION)
        .alphaTarget(END_SPEED);
    },
    toggleClusterTags = (
      toggleOn,
      nodes,
      uniqueClusterValues,
      clusterSelector,
    ) => {
      if (toggleOn) {
        clearTimeout(removeLabelsTimeout);
        const getBBox = el =>
          $(el) ? $(el).getBoundingClientRect() : { x: 0, y: 0, isEmpty: true };
        // 1. calculate the center of each cluster
        const calcCenter = clusterValue => {
          // return {x,y} cluster center-of-mass
          const clusterNodes = nodes.filter(
            node => node[clusterSelector] === clusterValue,
          );
          let numNodes = clusterNodes.length;

          const totals = clusterNodes.reduce(
            (acc, node) => {
              const nodeBB = getBBox(`#node_${node.id}`);
              if (nodeBB.isEmpty) {
                numNodes = numNodes - 1;
              }
              return {
                x: acc.x + nodeBB.x,
                y: acc.y + nodeBB.y,
              };
            },
            { x: 0, y: 0, denom: 1 },
          );
          // divide by the number of nodes in that cluster
          return { x: totals.x / numNodes, y: totals.y / numNodes };
        };

        const divWidth = 125;
        // 2. append a text svg for each cluster
        uniqueClusterValues.forEach((clusterTitle, idx) => {
          d3.select('#graphContainer')
            .append('div')
            .attr('class', 'clusterLabel')
            .attr('id', `clusterLabel_${idx}`)
            .style('left', `${calcCenter(clusterTitle).x - 0.5 * divWidth}px`)
            .style('top', `${calcCenter(clusterTitle).y}px`)
            .text(`${uniqueClusterValues[idx]}`)
            // transition in opacity
            // .style('opacity', 0)
            .style('opacity', 1);
        });
        // 3. set interval to reposition the text
        const updateTextPositions = () => {
          // for each cluster, calculate the cluster center and update the text position
          uniqueClusterValues.forEach((clusterTitle, idx) => {
            const divBB = getBBox(`#clusterLabel_${idx}`);
            d3.select(`#clusterLabel_${idx}`)
              .style(
                'left',
                `${calcCenter(clusterTitle).x - 0.5 * divBB.width}px`,
              )
              .style(
                'top',
                `${calcCenter(clusterTitle).y -
                  // move the div up by half its own height
                  0.5 * divBB.height}px`,
              );
          });
        };
        updatePositionsInterval = setInterval(updateTextPositions, 500);
      } else {
        d3.selectAll('.clusterLabel').style('opacity', 0);
        removeLabelsTimeout = setTimeout(
          () => d3.selectAll('.clusterLabel').remove(),
          500,
        );
        // remove text groups
        clearInterval(updatePositionsInterval);
      }
    },
    resetForceCharge = ({ getRadiusScale, radiusSelector }) => {
      const radiusScale = getRadiusScale();
      nsp.force.force(
        'charge',
        d3.forceManyBody().strength(d => {
          return -Math.pow(radiusScale(d[radiusSelector]), 2) - CLUSTER_PADDING;
        }),
      );
    },
    applySortForces = ({
      sortByValue,
      getRadiusScale,
      radiusSelector,
      // numClusters,
    }) => {
      nsp.resetForceCharge({ getRadiusScale, radiusSelector });

      const radiusScale = getRadiusScale();
      const [min, max] = radiusScale.range();
      const { width, height } = $('#graphContainer').getBoundingClientRect();
      const minLength = Math.min(width, height);
      // const { positionX, positionY } = getPositionXY({ numClusters });
      // sortedTypeX = d3.forceX(positionX).strength(CENTER_GRAVITY);
      // sortedTypeY = d3.forceY(positionY).strength(CENTER_GRAVITY);

      console.log({ sortByValue });

      if (!sortByValue) {
        nsp.force
          .force('sortedTypeX', null)
          .force('sortedTypeY', null)
          .force('tempSizeX', null)
          .force('tempSizeY', null)
          .force('sortedSizeY', null)
          .force('x', d3.forceX().strength(CENTER_GRAVITY))
          .force('y', d3.forceY().strength(CENTER_GRAVITY))
          .alpha(START_SPEED)
          .alphaDecay(START_FRICTION)
          .alphaTarget(END_SPEED);
        // } else if (sortByValue.includes('type') && sortByValue.includes('size')) {
        //   const SORT_BOTH_SPEED = 0.01;
        //   const SORT_BOTH_FRICTION = 0.007;

        //   sortedTypeX = d3.forceX(positionX).strength(CENTER_GRAVITY * 25);
        //   sortedTypeY = d3.forceY(positionY).strength(CENTER_GRAVITY * 33);
        //   nsp.force
        //     .force('tempSizeX', d3.forceX().strength(CENTER_GRAVITY * 15))
        //     .force('tempSizeY', d3.forceY().strength(CENTER_GRAVITY * -14.2))
        //     .force('sortedTypeX', sortedTypeX)
        //     .force('sortedTypeY', sortedTypeY)
        //     .force(
        //       'charge',
        //       d3.forceManyBody().strength(d => {
        //         return -Math.pow(radiusScale(d[radiusSelector]), 2.9) - 1500;
        //       }),
        //     )
        //     .force(
        //       'sortedSizeY',
        //       d3
        //         .forceY(d => {
        //           const radius = radiusScale(d[radiusSelector]);
        //           const normalizedRadius = (radius - min) / (max - min);
        //           const yPosition = (0.5 - normalizedRadius) * (minLength * 0.5);
        //           return yPosition;
        //         })
        //         .strength(CENTER_GRAVITY * 28),
        //     )
        //     .alpha(SORT_BOTH_SPEED)
        //     .alphaDecay(SORT_BOTH_FRICTION);
        // } else if (sortByValue === 'type') {
        //   const SORT_TYPE_SPEED = 0.5;
        //   const SORT_TYPE_FRICTION = 0.025;

        //   nsp.force
        //     .force('sortedTypeX', sortedTypeX)
        //     .force('sortedTypeY', sortedTypeY)
        //     .force(
        //       'charge',
        //       d3.forceManyBody().strength(d => {
        //         return -Math.pow(radiusScale(d[radiusSelector]), 2.13) - 0;
        //       }),
        //     )
        //     .force('tempSizeX', null)
        //     .force('tempSizeY', null)
        //     .force('sortedSizeY', null)
        //     .alpha(SORT_TYPE_SPEED)
        //     .alphaDecay(SORT_TYPE_FRICTION);
      } else if (sortByValue) {
        if (sortByValue === WORKERS) {
          const SORT_SIZE_SPEED = 0.045;
          const SORT_SIZE_FRICTION = 0.015;

          nsp.force
            .force('sortedTypeX', null)
            .force('sortedTypeY', null)
            .force('tempSizeX', d3.forceX().strength(CENTER_GRAVITY * 1.8))
            .force('tempSizeY', d3.forceY().strength(CENTER_GRAVITY * -16.6))
            .force(
              'sortedSizeY',
              d3
                .forceY(d => {
                  const radius = radiusScale(d[radiusSelector]);
                  const normalizedRadius = (radius - min) / (max - min);
                  const yPosition =
                    (0.5 - normalizedRadius) * (minLength * 0.5);
                  return yPosition;
                })
                .strength(CENTER_GRAVITY * 28),
            )
            .force(
              'charge',
              d3.forceManyBody().strength(d => {
                return -Math.pow(radiusScale(d[radiusSelector]), 2.16) - 150;
              }),
            )
            .alpha(SORT_SIZE_SPEED)
            .alphaDecay(SORT_SIZE_FRICTION)
            .alphaTarget(END_SPEED);
        }
      }
      nsp.force.restart();
    },
    getPositionXY = ({ numClusters }) => {
      const { width, height } = $('#graphContainer').getBoundingClientRect();
      // split the clusters evenly into the allotted space:
      const growXY = 1.5;
      // 5 columns maximum
      const minColWidth = 225;
      const numCols = Math.min(Math.ceil(width / minColWidth), 5);
      const growX = numCols === 2 ? 3 : 1;
      positionX = d => {
        // space horizontally into columns
        for (let i = numCols; i >= 0; i--) {
          // if you're in this column, go to position i
          if (d.cluster % numCols === i)
            return (i / numCols - 0.4) * width * growX * growXY;
          //! -0.4 works, why is -0.5 too much?
        }
      };

      // 10 rows maximum:
      const numRows = Math.min(Math.ceil(numClusters / numCols), 10);
      const growY = numRows === 2 ? 0.4 : numCols === 2 ? 2.5 : 1;
      positionY = d => {
        // space vertically into rows
        for (let i = numRows; i >= 0; i--) {
          // if you're in this row, go to position i
          if (d.cluster % numRows === i)
            return (i / numRows - 0.4) * height * growY * growXY;
          //! -0.4 works, why is -0.5 too much?
        }
      };
      return { positionX, positionY };
    },
    colourByValue = ({ doColour, variable }) => {
      if (doColour) {
        d3.selectAll('g.node circle')
          .transition()
          .delay((d, i) => i * 0.5)
          .style('fill', d =>
            getCircleColour({ d, colouredByValue: variable }),
          );
      } else {
        d3.selectAll('g.node circle')
          .transition()
          .delay((d, i) => i * 0.5)
          .style('fill', () => lightGrey);
      }
    },
    startSimulation = (
      { nodes, radiusScale, clusterCenters, radiusSelector },
      that,
    ) => {
      nsp.initForce({
        nodes,
        radiusScale,
        radiusSelector,
        clusterCenters,
      });
      nsp.tick(that);
      nsp.drag();
    },
    stopSimulation = () => {
      nsp.force.stop();
      paused = true;
      nsp.paused = true;
    },
    restartSimulation = (
      nodes,
      isStrongForce = false,
      isMediumForce = false,
    ) => {
      paused = false;
      nsp.paused = false;
      nsp.force
        .nodes(nodes)
        .force('x', d3.forceX().strength(CENTER_GRAVITY))
        .force('y', d3.forceY().strength(CENTER_GRAVITY))
        .velocityDecay(FRICTION)
        .alpha(RESTART_SPEED * (isStrongForce ? 0.03 : isMediumForce ? 0.3 : 1))
        .alphaDecay(START_FRICTION)
        .alphaTarget(END_SPEED)
        .restart();
    },
    enterNode = ({
      selection,
      radiusScale,
      radiusSelector,
      colouredByValue,
    }) => {
      // circles
      selection
        .select('circle')
        .attr('r', d => radiusScale(d[radiusSelector]))
        .style('fill', d => {
          switch (colouredByValue) {
            case 'automationRisk':
              return d3.interpolateRdYlGn(1 - d.automationRisk);
            case 'salary':
              return d3.interpolateGreens(d.salaryMed / 60);
            case 'study':
              return d3.interpolateBlues(d.yearsStudy / 5);
            case INDUSTRY:
              return color(d.cluster);
            default:
              return lightGrey;
          }
        });
    },
    updateNode = selection => {
      selection
        .attr('transform', d => nodeTransform(d))
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
          .on('end', dragEnded),
      ),
    removeDrag = () =>
      d3.selectAll('g.node').call(
        d3
          .drag()
          .on('start', null)
          .on('drag', null)
          .on('end', null),
      ),
    tick = that => {
      that.d3Graph = d3.select(ReactDOM.findDOMNode(that));
      nsp.force.on('tick', () => {
        that.d3Graph.call(updateGraph);
      });
    };

  nsp.nodeTransform = nodeTransform;
  nsp.enterNode = enterNode;
  nsp.updateNode = updateNode;
  nsp.updateGraph = updateGraph;
  nsp.cluster = cluster;
  nsp.initForce = initForce;
  nsp.startSimulation = startSimulation;
  nsp.stopSimulation = stopSimulation;
  nsp.toggleClusterTags = toggleClusterTags;
  nsp.resetForceCharge = resetForceCharge;
  nsp.applySortForces = applySortForces;
  nsp.sortedTypeX = sortedTypeX;
  nsp.sortedTypeY = sortedTypeY;
  nsp.getPositionXY = getPositionXY;
  nsp.positionX = positionX;
  nsp.positionY = positionY;
  nsp.colourByValue = colourByValue;
  nsp.restartSimulation = restartSimulation;
  nsp.dragStarted = dragStarted;
  nsp.dragging = dragging;
  nsp.dragEnded = dragEnded;
  nsp.drag = drag;
  nsp.removeDrag = removeDrag;
  nsp.tick = tick;
  nsp.paused = paused;
  nsp.color = color;

  return nsp;
};
FORCE(FORCE || {});

export default FORCE;
