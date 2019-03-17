import React, { Component } from 'react';
import styled from 'styled-components';
import FORCE from '../FORCE';
import Node from './Node';
// import SummaryStatistics from './SummaryStatistics';
import SVG3dEffect from './SVG3dEffect';

const VizStyles = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  justify-self: center;
  align-self: center;
  background: rgba(0, 0, 0, 0.01);
  box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, 0.1) inset;
  svg {
    width: 100%;
    height: 100%;
    #nodesG {
      transition: transform 0.5s ease-in-out;
      transform: translate(50%, 50%);
    }
    #summaryBar {
      transition: all 0.5s;
    }
    text {
      font-family: roboto light;
    }
  }
`;

// TODO: switch to hooks
class Viz extends Component {
  state = {
    activeNodeId: null,
    tooltip: null,
    // summaryStatistics: {
    //   // calculate summary statistics extents as needed in cDM or context
    //   yearsStudy: {
    //     min: 0,
    //     max: 0,
    //     glyph: <SchoolIcon />,
    //   },
    //   salaryMed: {
    //     min: 0,
    //     max: 0,
    //     glyph: <MoneyIcon />,
    //   },
    // },
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
      radiusScale,
      nodes,
      // summaryBarsActive,
    } = this.props;
    // const { summaryStatistics, totalNodes } = this.state;

    return (
      <React.Fragment>
        <VizStyles id="graphContainer" style={{ overflow: 'visible' }}>
          <svg id="svg">
            <g id="nodesG">
              {nodes.map(node => {
                return (
                  <Node
                    key={`vizNode_${node.noc}`}
                    onMouseMove={this.props.onMouseMove}
                    onMouseOut={this.props.onMouseOut}
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

            {/* {totalNodes > nodes.length && summaryBarsActive && (
              <SummaryStatistics
                summaryStatistics={summaryStatistics}
                nodes={nodes}
              />
            )} */}

            <SVG3dEffect />
          </svg>
        </VizStyles>
      </React.Fragment>
    );
  }
}

export default Viz;
