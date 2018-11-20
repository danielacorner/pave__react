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
      {context => (
        <LayoutContainer>
          <FiltersPanel filterVariables={filterVariables} />
          <SortPanel />
          <Viz
            filtersQuery={props.location.search}
            onLoadFromSnapshot={ssUrl => context.handleLoadFromSnapshot(ssUrl)}
            radiusScale={context.state.radiusScale()}
            radiusSelector={context.state.radiusSelector}
            clusterCenters={context.state.clusterCenters}
            nodes={context.state.nodes}
          />
          <SnapshotsPanel />
        </LayoutContainer>
      )}
    </ControlsContext.Consumer>
  );
};

export default Layout;
