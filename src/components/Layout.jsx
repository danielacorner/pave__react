import React from 'react';
import Viz from './Viz/Viz';
import LayoutContainer from './styles/LayoutContainer';
import FiltersPanel from './Filters/FiltersPanel';
import { ControlsContext } from './Context/ContextProvider';
import SnapshotsPanel from './Snapshot/SnapshotsPanel';
import SortPanel from './Sort/SortPanel';
// import queryString from 'query-string'

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

const Layout = props => {
  return (
    <ControlsContext.Consumer>
      {context => {
        const {
          radiusScale,
          radiusSelector,
          clusterCenters,
          nodes,
          summaryBarsActive,
        } = context.state;
        return (
          <LayoutContainer>
            <FiltersPanel filterVariables={filterVariables} />
            <SortPanel />
            <Viz
              filtersQuery={props.location.search}
              onLoadFromSnapshot={ssUrl =>
                context.handleLoadFromSnapshot(ssUrl)
              }
              radiusScale={radiusScale()}
              radiusSelector={radiusSelector}
              clusterCenters={clusterCenters}
              nodes={nodes}
              summaryBarsActive={summaryBarsActive}
            />
            <SnapshotsPanel />
          </LayoutContainer>
        );
      }}
    </ControlsContext.Consumer>
  );
};

export default Layout;
