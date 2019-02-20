// import queryString from 'query-string'
import { localPoint } from '@vx/event';
import React, { useContext, useState } from 'react';
import { ControlsContext } from './Context/ContextProvider';
import FiltersPanel from './Filters/FiltersPanel';
import SnapshotsPanel from './Snapshot/SnapshotsPanel';
import SortPanel from './Sort/SortPanel';
import LayoutContainer from './styles/LayoutContainer';
import Tooltip from './Tooltip';
import Viz from './Viz/Viz';

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

const Layout = props => {
  const [tooltipProps, setTooltipProps] = useState(null);
  const context = useContext(ControlsContext);
  const {
    getRadiusScale,
    radiusSelector,
    clusterSelector,
    clusterCenters,
    nodes,
    summaryBarsActive,
    zScale,
  } = context.state;
  // TODO: can achieve performance gains with react memo anywhere?
  // console.count('rendered layout')
  return (
    <React.Fragment>
      <LayoutContainer>
        <FiltersPanel filterVariables={filterVariables} />
        <SortPanel />
        <Viz
          onMouseMove={(event, datum) => {
            const { x, y } = localPoint(event.target.ownerSVGElement, event);
            // console.log('event:', event);
            // console.log('datum:', datum);
            const tooltipProps = {
              data: datum,
              top: y,
              left: x + 20,
            };
            setTooltipProps(tooltipProps);
          }}
          onMouseOut={() => setTooltipProps(null)}
          filtersQuery={props.location.search}
          onLoadFromSnapshot={ssUrl => context.handleLoadFromSnapshot(ssUrl)}
          radiusScale={getRadiusScale()}
          radiusSelector={radiusSelector}
          clusterSelector={clusterSelector}
          clusterCenters={clusterCenters}
          nodes={nodes}
          summaryBarsActive={summaryBarsActive}
          zScale={zScale}
        />
        <SnapshotsPanel />
      </LayoutContainer>
      {tooltipProps && <Tooltip {...tooltipProps} />}
    </React.Fragment>
  );
};

export default Layout;
