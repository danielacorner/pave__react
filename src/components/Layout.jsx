// import queryString from 'query-string'
import React from 'react';
import { ControlsContext } from './Context/ContextProvider';
import FiltersPanel from './Filters/FiltersPanel';
import SnapshotsPanel from './Snapshot/SnapshotsPanel';
import SortPanel from './Sort/SortPanel';
import LayoutContainer from './styles/LayoutContainer';
import Viz from './Viz/Viz';
// import { localPoint } from '@vx/event';

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

class Layout extends React.PureComponent {
  render() {
    return (
      <ControlsContext.Consumer>
        {context => {
          const {
            radiusScale,
            radiusSelector,
            clusterSelector,
            clusterCenters,
            nodes,
            summaryBarsActive,
            zScale,
          } = context.state;

          console.count('rendering viz!');
          return (
            <React.Fragment>
              <LayoutContainer>
                <FiltersPanel filterVariables={filterVariables} />
                <SortPanel />
                <Viz
                  filtersQuery={this.props.location.search}
                  onLoadFromSnapshot={ssUrl =>
                    context.handleLoadFromSnapshot(ssUrl)
                  }
                  radiusScale={radiusScale()}
                  radiusSelector={radiusSelector}
                  clusterSelector={clusterSelector}
                  clusterCenters={clusterCenters}
                  nodes={nodes}
                  summaryBarsActive={summaryBarsActive}
                  zScale={zScale}
                />
                <SnapshotsPanel />
              </LayoutContainer>
            </React.Fragment>
          );
        }}
      </ControlsContext.Consumer>
    );
  }
}

export default Layout;
