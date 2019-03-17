// import queryString from 'query-string'
import { localPoint } from '@vx/event';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ControlsContext } from './Context/ContextProvider';
import FiltersPanel from './Controls/FiltersPanel';
import SnapshotsPanel from './Controls/SnapshotsPanel';
import SortPanel from './Controls/SortPanel';
import Tooltip from './Viz/Tooltip';
import Viz from './Viz/Viz';

const LayoutStyles = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-gap: 16px;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
`;

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
      <LayoutStyles>
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
      </LayoutStyles>
      {tooltipProps && <Tooltip {...tooltipProps} />}
    </React.Fragment>
  );
};

export default Layout;
