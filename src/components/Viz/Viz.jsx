import React, { PureComponent } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainerStyles';
import SVG3dEffect from './SVG3dEffect';
import SummaryBar from './SummaryBar';
import { ControlsContext } from '../Context/ContextProvider';
import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import { scaleLinear, scaleLog } from '@vx/scale';

// const getMin = (nodes, stat) =>
//   nodes.reduce(
//     (min, node) => (node[stat] < min ? node[stat] : min),
//     nodes[0][stat],
//   );
// const getMax = (nodes, stat) =>
//   nodes.reduce(
//     (max, node) => (node[stat] > max ? node[stat] : max),
//     nodes[0][stat],
//   );

class Viz extends PureComponent {
  state = {
    activeNodeId: null,
    summaryStatistics: {
      // calculate summary statistics extents as needed in cDM or context
      yearsStudy: {
        min: 0,
        max: 0,
        glyph: <SchoolIcon />,
      },
      salaryMed: {
        min: 0,
        max: 0,
        glyph: <MoneyIcon />,
      },
    },
  };
  componentDidMount() {
    const { nodes, radiusScale, clusterCenters, radiusSelector } = this.props;

    // initialize the force simulation
    FORCE.startSimulation(
      { nodes, radiusScale, clusterCenters, radiusSelector },
      this,
    );

    const max = stat => Math.max(...nodes.map(n => n[stat]));
    const min = stat => Math.min(...nodes.map(n => n[stat]));
    // calculate summary statistics min, max
    console.log(min('salaryMed'));

    this.setState({
      summaryStatistics: {
        // ...this.state.summaryStatistics,
        yearsStudy: {
          min: min('yearsStudy'),
          max: max('yearsStudy'),
        },
        salaryMed: {
          min: min('salaryMed'),
          max: max('salaryMed'),
        },
      },
    });

    // if applying a snapshot, handle in ContextProvider
    this.props.filterQuery &&
      this.props.onLoadFromSnapshot(this.props.filterQuery);
  }
  handleClick = nodeId => {
    // apply 3d effect to clicked node
    this.setState({ activeNodeId: nodeId });
  };
  render() {
    const { radiusSelector, radiusScale, nodes } = this.props;
    const { summaryStatistics } = this.state;
    return (
      <GraphContainer id="graphContainer" style={{ overflow: 'visible' }}>
        <svg id="svg">
          <g id="nodesG">
            {nodes.map(node => {
              return (
                <Node
                  onClick={() => {
                    this.handleClick(node.id);
                  }}
                  radiusSelector={radiusSelector}
                  radiusScale={radiusScale}
                  data={node}
                  name={node.name}
                  key={`vizNode_${node.id}`}
                  isActive={this.state.activeNodeId === node.id}
                />
              );
            })}
          </g>

          {summaryStatistics.yearsStudy.max > 0 && (
            <ControlsContext.Consumer>
              {context => {
                const avgStatistic = (nodes, stat) =>
                  nodes.reduce((tot, node) => tot + node[stat], 0) /
                  nodes.length;

                // returns value between 0 and 1
                const normalize = (value, min, max) =>
                  (value - min) / (max - min);

                const { height, width } = context.state.svgBBox;

                const scaleLeft = scaleLinear({
                  range: [height, 0],
                  rangeRound: 1,
                  domain: [
                    summaryStatistics['yearsStudy'].min,
                    summaryStatistics['yearsStudy'].max,
                  ],
                  // nice: false,
                  // clamp: false,
                });

                // multiply value btw 0 & 1 by svg height

                console.log(
                  summaryStatistics.yearsStudy.min,
                  summaryStatistics.yearsStudy.max,
                  summaryStatistics.salaryMed.min,
                  summaryStatistics.salaryMed.max,
                );

                const [avgLeft, avgRight] = [
                  avgStatistic(nodes, 'yearsStudy'),
                  avgStatistic(nodes, 'salaryMed'),
                ];

                const getHeight = (stat, avg) =>
                  normalize(
                    avg,
                    summaryStatistics[stat].min,
                    summaryStatistics[stat].max,
                  );

                const [heightLeft, heightRight] = [
                  getHeight('yearsStudy', avgLeft) * height,
                  getHeight('salaryMed', avgRight) * height,
                ];

                const barWidth = 20;
                const labelLeft = 'Years of Study';
                const labelRight = 'Salary ($1,000 / year)';

                return (
                  <svg>
                    {/* left */}
                    <SummaryBar
                      // yScale={scaleLeft}
                      value={avgLeft}
                      x={0}
                      y={height - heightLeft || 0}
                      height={heightLeft || 0}
                      width={barWidth}
                      fill={'#2371ca'}
                      label={labelLeft}
                      labelColor={'rgba(255,255,255,0.98)'}
                      valueColor={'rgba(0,0,0,0.98)'}
                    />
                    {/* right */}
                    <SummaryBar
                      value={avgRight}
                      x={width - barWidth || 0}
                      y={height - heightRight || 0}
                      height={heightRight || 0}
                      width={barWidth}
                      fill={'forestgreen'}
                      label={labelRight}
                      labelColor={'rgba(255,255,255,0.98)'}
                      valueColor={'rgba(0,0,0,0.98)'}
                    />
                  </svg>
                );
              }}
            </ControlsContext.Consumer>
          )}

          <SVG3dEffect />
        </svg>
      </GraphContainer>
    );
  }
}

export default Viz;
