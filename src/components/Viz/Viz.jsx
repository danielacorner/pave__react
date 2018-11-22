import React, { PureComponent } from 'react';
import FORCE from '../FORCE';
import Node from './Node';
import GraphContainer from '../styles/GraphContainerStyles';
import SVG3dEffect from './SVG3dEffect';
import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import SummaryStatistics from './SummaryStatistics';

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
            <SummaryStatistics
              summaryStatistics={summaryStatistics}
              nodes={nodes}
            />
          )}

          <SVG3dEffect />
        </svg>
      </GraphContainer>
    );
  }
}

export default Viz;
