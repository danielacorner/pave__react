import React from 'react';
import Viz from './Viz/Viz';
import LayoutContainer from './styles/LayoutContainer';
import FiltersPanel from './Filters/FiltersPanel';
import { ControlsContext } from './Context/ContextProvider';
import SnapshotsPanel from './Snapshot/SnapshotsPanel';
import SortPanel from './Sort/SortPanel';
// import queryString from 'query-string'
import { withTooltip, Tooltip } from '@vx/tooltip';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';

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
          tooltipOpen,
          tooltipLeft,
          tooltipTop,
          tooltipData,
          hideTooltip,
          showTooltip,
        } = props;
        const {
          radiusScale,
          radiusSelector,
          clusterSelector,
          clusterCenters,
          nodes,
          summaryBarsActive,
        } = context.state;
        const keys = nodes
          .map(d => d[clusterSelector])
          .filter((value, index, self) => self.indexOf(value) === index);

        const zScale = scaleOrdinal({
          domain: keys,
          range: ['#6c5efb', '#c998ff', '#a44afe'],
        });
        return (
          <React.Fragment>
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
                clusterSelector={clusterSelector}
                clusterCenters={clusterCenters}
                nodes={nodes}
                summaryBarsActive={summaryBarsActive}
                tooltipOpen={false}
              />
              <SnapshotsPanel />
            </LayoutContainer>
            {tooltipOpen && (
              <Tooltip
                top={tooltipTop}
                left={tooltipLeft}
                style={{
                  minWidth: 60,
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  color: 'white',
                }}
              >
                <div style={{ color: zScale(tooltipData.key) }}>
                  <strong>{tooltipData.key}</strong>
                </div>
                <div>{tooltipData.data[tooltipData.key]}℉</div>
                <div>
                  <small>{tooltipData.xFormatted}</small>
                </div>
              </Tooltip>
            )}
          </React.Fragment>
        );
      }}
    </ControlsContext.Consumer>
  );
};

export default withTooltip(Layout);
