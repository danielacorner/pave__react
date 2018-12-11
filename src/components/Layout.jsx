// import queryString from 'query-string'
import React from 'react';
import { ControlsContext } from './Context/ContextProvider';
import FiltersPanel from './Filters/FiltersPanel';
import SnapshotsPanel from './Snapshot/SnapshotsPanel';
import SortPanel from './Sort/SortPanel';
import LayoutContainer from './styles/LayoutContainer';
import Tooltip from './Tooltip/Tooltip';
import Viz from './Viz/Viz';
// import { localPoint } from '@vx/event';

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

class Layout extends React.PureComponent {
  state = { tooltip: null };
  render() {
    const { tooltip } = this.state;
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
              {tooltip && <Tooltip tooltip={tooltip} />}
            </React.Fragment>
          );
        }}
      </ControlsContext.Consumer>
    );
  }
}

export default Layout;
