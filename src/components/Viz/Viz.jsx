import React, { Component } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainerStyles';
import SVG3dEffect from './SVG3dEffect';
import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import SummaryStatistics from './SummaryStatistics';
// import { withTooltip, Tooltip } from '@vx/tooltip';
// import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';

class Viz extends Component {
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
      totalNodes: nodes.length,
      summaryStatistics: {
        // ...this.state.summaryStatistics,
        yearsStudy: {
          min: min('yearsStudy'),
          max: max('yearsStudy'),
        },
        salaryMed: {
          min: min('salaryMed'),
          //! "trimming" salary outliers
          max: max('salaryMed') - 50,
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
    const {
      radiusSelector,
      // clusterSelector,
      radiusScale,
      nodes,
      summaryBarsActive,
      // tooltipOpen,
      // tooltipLeft,
      // tooltipTop,
      // tooltipData,
      // hideTooltip,
      // showTooltip,
    } = this.props;
    const { summaryStatistics, totalNodes } = this.state;

    // const keys = nodes
    //   .map(d => d[clusterSelector])
    //   .filter((value, index, self) => self.indexOf(value) === index);

    // const zScale = scaleOrdinal({
    //   domain: keys,
    //   range: ['#6c5efb', '#c998ff', '#a44afe'],
    // });

    return (
      <React.Fragment>
        <GraphContainer id="graphContainer" style={{ overflow: 'visible' }}>
          <svg id="svg">
            <g id="nodesG">
              {nodes.map(node => {
                return (
                  <Node
                    onMouseMove={data => event => {
                      console.log('mousemove!');
                    }}
                    onMouseLeave={data => event => {}}
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

            {totalNodes > nodes.length && summaryBarsActive && (
              <SummaryStatistics
                summaryStatistics={summaryStatistics}
                nodes={nodes}
              />
            )}

            <SVG3dEffect />
          </svg>
        </GraphContainer>
        {/* {tooltipOpen && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              minWidth: 60,
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: 'white',
            }}
          >
            <div style={{ color: zScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.data[tooltipData.key]}℉</div>
            <div>
              <small>{tooltipData.xFormatted}</small>
            </div>
          </Tooltip>
        )} */}
      </React.Fragment>
    );
  }
}

export default Viz;
