import React from 'react';
import Viz from './Viz/Viz';
import LayoutContainer from './styles/LayoutContainer';
import FiltersPanel from './Filters/FiltersPanel';
import { ControlsContext } from './Context/ContextProvider';
import SnapshotsPanel from './Snapshot/SnapshotsPanel';
import SortPanel from './Sort/SortPanel';
// import queryString from 'query-string'
import { withTooltip, TooltipWithBounds } from '@vx/tooltip';
import { /* scaleBand, scaleLinear, */ scaleOrdinal } from '@vx/scale';
// import { localPoint } from '@vx/event';

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

class Layout extends React.Component {
  handleMouseOver = (event, datum) => {
    // const coords = localPoint(event.target.ownerSVGElement, event);
    // console.log('event:', event);
    // console.log('datum:', datum);
    // console.log('coords:', coords);
    this.props.showTooltip({
      tooltipLeft: event.clientX,
      // tooltipLeft: coords.x,
      tooltipTop: event.clientY,
      // tooltipTop: coords.y,
      tooltipData: datum,
    });
  };
  render() {
    return (
      <ControlsContext.Consumer>
        {context => {
          const {
            tooltipOpen,
            tooltipLeft,
            tooltipTop,
            tooltipData,
            hideTooltip,
            // showTooltip,
          } = this.props;
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
                  onMouseOver={(event, data) =>
                    this.handleMouseOver(event, data)
                  }
                  onMouseOut={hideTooltip}
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
                />
                <SnapshotsPanel />
              </LayoutContainer>
              {tooltipOpen && (
                <TooltipWithBounds
                  top={tooltipTop}
                  left={tooltipLeft}
                  style={{
                    minWidth: 60,
                    maxWidth: 200,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    fontFamily: 'Verdana',
                    margin: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Roboto light',
                      color: zScale(tooltipData[clusterSelector]),
                    }}
                  >
                    <h3>{tooltipData.job}</h3>
                  </div>
                  <div>
                    <p style={{ textAlign: 'left' }}>
                      <small>Industry:</small>
                    </p>
                    <p style={{ textAlign: 'right' }}>{tooltipData.industry}</p>
                    <p style={{ textAlign: 'left' }}>
                      <small>Salary (median):</small>
                    </p>
                    <p style={{ textAlign: 'right' }}>
                      ${tooltipData.salaryMed} per year
                    </p>
                    <p style={{ textAlign: 'left' }}>
                      <small>Risk of machine automation: </small>
                    </p>
                    <p style={{ textAlign: 'right' }}>
                      {tooltipData.automationRisk.toFixed(2) * 100}%
                    </p>
                  </div>
                </TooltipWithBounds>
              )}
            </React.Fragment>
          );
        }}
      </ControlsContext.Consumer>
    );
  }
}

export default withTooltip(Layout);
