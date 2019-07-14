import * as d3 from 'd3';
import { findDOMNode } from 'react-dom';
import { $ } from './Context/ContextProvider';
import {
  WORKERS,
  INDUSTRY,
  AUTOMATION_RISK,
  SALARY,
  STUDY,
} from './Controls/SortPanel';

export const lightGrey = 'hsl(0,0%,80%)';
export const color = d3.scaleOrdinal(d3.schemeCategory10);
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

// TODO: values?
export const SALARY_MAX = 125;
export const SALARY_MIN = 10;
export const SALARY_AVG = (SALARY_MAX - SALARY_MIN) / 2;
// TODO: values?
export const STUDY_MAX = 6;
export const STUDY_MIN = 0.5;
export const STUDY_AVG = (STUDY_MAX - STUDY_MIN) / 2;

const FORCE = function(nsp) {
  let paused, updatePositionsInterval, removeLabelsTimeout, isGraphView;
  const // optional: constrain nodes within a bounding box
    nodeTransform = d => {
      // const minLength = Math.min(width, height) * 0.75;
      // const constrainedX = Math.min(Math.max(d.x, -minLength), minLength);
      // const constrainedY = Math.min(Math.max(d.y, -minLength), minLength);
      // return 'translate(' + constrainedX + ',' + constrainedY + ')';
      return `translate(${d.x || 0},${d.y || 0})`;
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
        // .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
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
    applySortForces = ({ sortByValue, getRadiusScale, radiusSelector }) => {
      nsp.resetForceCharge({ getRadiusScale, radiusSelector });

      const radiusScale = getRadiusScale();
      const [min, max] = radiusScale.range();
      const { width, height } = $('#graphContainer').getBoundingClientRect();
      const minLength = Math.min(width, height);

      if (!sortByValue) {
        nsp.force
          .force('tempSortX', null)
          .force('tempSortY', null)
          .force('sortedSizeY', null)
          .force('x', d3.forceX().strength(CENTER_GRAVITY))
          .force('y', d3.forceY().strength(CENTER_GRAVITY))
          .alpha(START_SPEED)
          .alphaDecay(START_FRICTION)
          .alphaTarget(END_SPEED);
      } else if (sortByValue) {
        const SORT_SPEED = 0.045;
        const SORT_FRICTION = 0.015;
        if (sortByValue === WORKERS) {
          nsp.force
            .force('tempSortX', d3.forceX().strength(CENTER_GRAVITY * 2.0))
            .force('tempSortY', d3.forceY().strength(CENTER_GRAVITY * -18.6))
            .force(
              'sortedSizeY',
              d3
                .forceY(d => {
                  const radius = radiusScale(d[WORKERS]);
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
                return -Math.pow(radiusScale(d[WORKERS]), 2.16) - 150;
              }),
            )
            .alpha(SORT_SPEED)
            .alphaDecay(SORT_FRICTION)
            .alphaTarget(END_SPEED);
        } else if (sortByValue === AUTOMATION_RISK) {
          const DY = 235;
          nsp.force
            .force('tempSortX', d3.forceX().strength(CENTER_GRAVITY * 1.8))
            .force('tempSortY', d3.forceY().strength(CENTER_GRAVITY * -16.6))
            .force(
              'sortedSizeY',
              d3
                .forceY(d => {
                  const yPosition = (d[AUTOMATION_RISK] - 0.5) * DY;
                  return yPosition;
                })
                .strength(CENTER_GRAVITY * 28),
            )
            .force(
              'charge',
              d3.forceManyBody().strength(d => {
                return -Math.pow(radiusScale(d[WORKERS]), 2.16) - 150;
              }),
            )
            .alpha(SORT_SPEED)
            .alphaDecay(SORT_FRICTION)
            .alphaTarget(END_SPEED);
        } else if (sortByValue === SALARY) {
          const DY = 200;

          nsp.force
            .force('tempSortX', d3.forceX().strength(CENTER_GRAVITY * 1.8))
            .force('tempSortY', d3.forceY().strength(CENTER_GRAVITY * -16.6))
            .force(
              'sortedSizeY',
              d3
                .forceY(d => {
                  const yPosition =
                    Math.log2(
                      (d['salaryMed'] + 1.2 * SALARY_AVG - SALARY_MIN) /
                        (SALARY_MAX - SALARY_MIN),
                    ) * DY;
                  return -yPosition;
                })
                .strength(CENTER_GRAVITY * 28),
            )
            .force(
              'charge',
              d3.forceManyBody().strength(d => {
                return -Math.pow(radiusScale(d[WORKERS]), 2.16) - 150;
              }),
            )
            .alpha(SORT_SPEED)
            .alphaDecay(SORT_FRICTION)
            .alphaTarget(END_SPEED);
        } else if (sortByValue === STUDY) {
          const DY = 260;

          nsp.force
            .force('tempSortX', d3.forceX().strength(CENTER_GRAVITY * 1.8))
            .force('tempSortY', d3.forceY().strength(CENTER_GRAVITY * -16.6))
            .force(
              'sortedSizeY',
              d3
                .forceY(d => {
                  const yPosition =
                    Math.log2(
                      (d['yearsStudy'] + 1.2 * STUDY_AVG - STUDY_MIN) /
                        (STUDY_MAX - STUDY_MIN),
                    ) * DY;
                  return -yPosition;
                })
                .strength(CENTER_GRAVITY * 28),
            )
            .force(
              'charge',
              d3.forceManyBody().strength(d => {
                return -Math.pow(radiusScale(d[WORKERS]), 2.16) - 150;
              }),
            )
            .alpha(SORT_SPEED)
            .alphaDecay(SORT_FRICTION)
            .alphaTarget(END_SPEED);
        }
      }
      nsp.force.restart();
    },
    colourByValue = ({ doColour, value }) => {
      if (doColour) {
        d3.selectAll('g.node circle')
          .transition()
          .delay((d, i) => i * 0.5)
          .style('fill', d => getCircleColour({ d, colouredByValue: value }));
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
      // nsp.drag();
    },
    stopSimulation = (newIsGraphView = false) => {
      nsp.force.stop();
      paused = true;
      nsp.paused = true;
      isGraphView = newIsGraphView;
      nsp.isGraphView = newIsGraphView;
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
        })
        .style('transform', 'scale(1)');
    },
    updateNode = selection => {
      selection.attr('transform', d => (d ? nodeTransform(d) : ''));
      // .attr('cx', d => (d ? d.x : 0))
      // .attr('cy', d => (d ? d.y : 0));
    },
    updateGraph = selection => {
      selection.selectAll('.node').call(updateNode);
    },
    // dragStarted = d => {
    //   if (!d3.event.active) nsp.force.alphaTarget(0.3).restart();
    //   d.fx = d.x;
    //   d.fy = d.y;
    // },
    // dragging = d => {
    //   d.fx = d3.event.x;
    //   d.fy = d3.event.y;
    // },
    // dragEnded = d => {
    //   if (!d3.event.active) nsp.force.alphaTarget(0);
    //   d.fx = null;
    //   d.fy = null;
    // },
    // drag = () =>
    //   d3.selectAll('g.node').call(
    //     d3
    //       .drag()
    //       .on('start', dragStarted)
    //       .on('drag', dragging)
    //       .on('end', dragEnded),
    //   ),
    // removeDrag = () =>
    //   d3.selectAll('g.node').call(
    //     d3
    //       .drag()
    //       .on('start', null)
    //       .on('drag', null)
    //       .on('end', null),
    //   ),
    tick = that => {
      that.d3Graph = d3.select(findDOMNode(that));
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
  nsp.colourByValue = colourByValue;
  nsp.restartSimulation = restartSimulation;
  // nsp.dragStarted = dragStarted;
  // nsp.dragging = dragging;
  // nsp.dragEnded = dragEnded;
  // nsp.drag = drag;
  // nsp.removeDrag = removeDrag;
  nsp.tick = tick;
  nsp.paused = paused;
  nsp.isGraphView = isGraphView;
  nsp.color = color;

  return nsp;
};
FORCE(FORCE || {});

export default FORCE;
