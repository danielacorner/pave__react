import React, { PureComponent } from 'react';
import Viz from './Viz/Viz';
import styled from 'styled-components';
import FiltersPanel from './Controls/Filters/FiltersPanel';
import NOCData from '../assets/NOC-data';
import * as d3 from 'd3';
import ContextProvider, { ControlsContext } from './Controls/ContextProvider';
import SnapshotsPanel from './Controls/Snapshot/SnapshotsPanel';
import SortPanel from './Controls/Sort/SortPanel';

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 95vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-gap: 20px;
  padding: 20px;
  box-sizing: border-box;
`;

class Layout extends PureComponent {
  state = {
    clusterSelector: 'industry',
    radiusSelector: 'workers',
    radiusScale: () => {
      const radii = NOCData.map(d => d[this.state.radiusSelector]);
      const radiusRange = [5, 50];
      return d3
        .scaleSqrt() // square root scale because radius of a circle
        .domain([d3.min(radii), d3.max(radii)])
        .range(radiusRange);
    },
    uniqueClusterValues: NOCData.map(d => d['industry']).filter(
      (value, index, self) => self.indexOf(value) === index,
    ),
    clusterCenters: [],
  };

  componentWillMount = () => {
    const {
      clusterCenters,
      radiusSelector,
      clusterSelector,
      uniqueClusterValues,
    } = this.state;

    // initialize the clusters
    NOCData.forEach(d => {
      const cluster = uniqueClusterValues.indexOf(d[clusterSelector]) + 1;
      // add to clusters array if it doesn't exist or the radius is larger than any other radius in the cluster
      if (
        !clusterCenters[cluster] ||
        d[radiusSelector] > clusterCenters[cluster][radiusSelector]
      ) {
        clusterCenters[cluster] = d;
        // todo: emit new cluster centers to/from context
        this.setState({ clusterCenters: clusterCenters });
      }
      // if ([1, 100, 200, 300, 400].includes(d.id)) {
      // }
    });
  };

  render() {
    const {
      // forceCluster,
      clusterCenters,
      radiusSelector,
      // clusterSelector
    } = this.state;
    const { filterState } = this.props;

    return (
      <ContextProvider>
        <ControlsContext.Consumer>
          {context => (
            <Container>
              <FiltersPanel filterVariables={filterVariables} />
              <SortPanel />
              <Viz
                filterState={filterState}
                onLoadFromSnapshot={ssUrl =>
                  context.handleLoadFromSnapshot(ssUrl)
                }
                radiusScale={this.state.radiusScale()}
                radiusSelector={radiusSelector}
                clusterCenters={clusterCenters}
                nodes={context.state.nodes}
              />
              <SnapshotsPanel />
            </Container>
          )}
        </ControlsContext.Consumer>
      </ContextProvider>
    );
  }
}

export default Layout;
