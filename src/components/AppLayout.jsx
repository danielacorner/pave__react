// import queryString from 'query-string'
import { localPoint } from '@vx/event';
import React, { useContext, useState } from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';
import { TABLET_MIN_WIDTH } from '../utils/constants';
import { ControlsContext } from './Context/ContextProvider';
import FiltersPanel from './Controls/FiltersPanel';
import SortPanel from './Controls/SortPanel';
import MobileTooltip from './Viz/MobileTooltip';
import Tooltip from './Viz/Tooltip';
import Viz from './Viz/Viz';

const AppLayoutStyles = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-gap: 8px;
  @media (min-width: 400px) {
    grid-gap: 16px;
  }
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
`;

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

const AppLayout = props => {
  const [tooltipProps, setTooltipProps] = useState(null);
  const [mobileTooltipProps, setMobileTooltipProps] = useState(null);
  const context = useContext(ControlsContext);
  const initialExpandedState = {
    skillsLang: false,
    skillsLogi: false,
    skillsMath: false,
    skillsComp: false,
  };
  const [expanded, setExpanded] = useState(initialExpandedState);
  const {
    getRadiusScale,
    radiusSelector,
    clusterSelector,
    clusterCenters,
    nodes,
    summaryBarsActive,
    zScale,
    sortedRisk,
  } = context.state;

  // TODO: mobile layout
  // TODO: mobile tooltip

  return (
    <MediaQuery query={`(min-width: ${TABLET_MIN_WIDTH}px)`}>
      {isTabletOrLarger => (
        <React.Fragment>
          <AppLayoutStyles
            onClick={
              // TODO: why doesn't this work on mobile every time?
              isTabletOrLarger
                ? event => {
                    if (
                      Array.from(event.target.classList).includes(
                        'slidersDiv',
                      ) ||
                      event.target.id === 'svg' ||
                      event.target.nodeName === 'circle'
                    ) {
                      setExpanded(initialExpandedState);
                    }
                  }
                : event => {
                    if (
                      Array.from(event.target.classList).includes(
                        'slidersDiv',
                      ) ||
                      event.target.id === 'svg' ||
                      event.target.nodeName === 'circle'
                    ) {
                      setExpanded(initialExpandedState);
                    }
                    if (event.target.nodeName !== 'circle') {
                      setMobileTooltipProps(null);
                    }
                  }
            }
          >
            <FiltersPanel
              filterVariables={filterVariables}
              expanded={expanded}
              setExpanded={setExpanded}
              initialExpandedState={initialExpandedState}
            />
            <SortPanel
              initialExpandedState={initialExpandedState}
              setExpanded={setExpanded}
            />
            <Viz
              isTabletOrLarger={isTabletOrLarger}
              sortedRisk={sortedRisk}
              onMouseMove={
                isTabletOrLarger
                  ? (event, datum) => {
                      const { x, y } = localPoint(
                        event.target.ownerSVGElement,
                        event,
                      );
                      // console.log('event:', event);
                      // console.log('datum:', datum);
                      const tooltipProps = {
                        data: datum,
                        top: y,
                        left: x + 20,
                      };
                      setTooltipProps(tooltipProps);
                    }
                  : () => {}
              }
              onClick={datum => {
                const mobileTooltipProps = {
                  data: datum,
                  setMobileTooltipProps,
                };
                setMobileTooltipProps(mobileTooltipProps);
              }}
              onMouseOut={
                isTabletOrLarger
                  ? () => {
                      setTooltipProps(null);
                    }
                  : () => {}
              }
              filtersQuery={props.location.search}
              onLoadFromSnapshot={ssUrl =>
                context.handleLoadFromSnapshot(ssUrl)
              }
              radiusScale={getRadiusScale()}
              radiusSelector={radiusSelector}
              clusterSelector={clusterSelector}
              clusterCenters={clusterCenters}
              nodes={nodes}
              summaryBarsActive={summaryBarsActive}
              zScale={zScale}
            />
          </AppLayoutStyles>

          {tooltipProps && isTabletOrLarger && <Tooltip {...tooltipProps} />}
          {!isTabletOrLarger && <MobileTooltip {...mobileTooltipProps} />}
        </React.Fragment>
      )}
    </MediaQuery>
  );
};

export default AppLayout;
