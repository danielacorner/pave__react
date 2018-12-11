import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import React, { Component } from 'react';
import FORCE from '../FORCE';
import GraphContainer from '../styles/GraphContainerStyles';
import Tooltip from '../Tooltip/Tooltip';
import Node from './Node';
import SummaryStatistics from './SummaryStatistics';
import SVG3dEffect from './SVG3dEffect';
// import { withTooltip, Tooltip } from '@vx/tooltip';
// import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';

class Viz extends Component {
  state = {
    activeNodeId: null,
    tooltip: null,
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
      clusterSelector,
      radiusScale,
      nodes,
      summaryBarsActive,
      zScale,
    } = this.props;
    const { summaryStatistics, totalNodes, tooltip } = this.state;

    return (
      <React.Fragment>
        <GraphContainer
          id="graphContainer"
          style={{ overflow: 'visible' }}
          // onMouseOver={(event, data) => this.handleMouseOver(event, data)}
          // onMouseOut={hideTooltip}
        >
          <svg id="svg">
            <g id="nodesG">
              {nodes.map(node => {
                return (
                  <Node
                    key={`vizNode_${node.noc}`}
                    onMouseOver={(event, datum) => {
                      // const coords = localPoint(event.target.ownerSVGElement, event);
                      // console.log('event:', event);
                      // console.log('datum:', datum);
                      // console.log('coords:', coords);
                      console.count('rendering tooltip', datum);
                      const tooltip = {
                        data: datum,
                        top: event.clientY,
                        left: event.clientX,
                        zScale: zScale,
                        clusterSelector: clusterSelector,
                      };
                      this.setState({ tooltip });
                    }}
                    onMouseOut={() => this.setState({ tooltip: null })}
                    onClick={() => {
                      this.handleClick(node.id);
                    }}
                    radiusSelector={radiusSelector}
                    radiusScale={radiusScale}
                    data={node}
                    name={node.name}
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
        {tooltip && <Tooltip tooltip={tooltip} />}
      </React.Fragment>
    );
  }
}

export default Viz;
