// import queryString from 'query-string'
import { localPoint } from '@vx/event';
import React, { useContext, useState, useEffect } from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';
import { TABLET_MIN_WIDTH, RESIZE_INTERVAL_MS } from '../utils/constants';
import { ControlsContext } from './Context/ContextProvider';
import FiltersPanel from './Controls/FiltersPanel';
import SortPanel from './Controls/SortPanel';
import MobileTooltip from './Viz/MobileTooltip';
import Tooltip from './Viz/Tooltip';
import Viz from './Viz/Viz';
import Legend from './Viz/Legend';

const AppTitleStyles = styled.div`
  font-family: system-ui;
  margin: 8px 12px 0 12px;
  h1 {
    font-size: 24px;
    margin: 0;
  }
  h5 {
    margin: 8px 0 0 0;
  }
  span {
    font-size: 18px;
    text-shadow: none;
  }
`;
const AppTitle = () => (
  <MediaQuery query={`(min-width: ${TABLET_MIN_WIDTH}px)`}>
    {isTabletOrLarger => (
      <AppTitleStyles>
        <h1>
          Goodjob 🎈 <span>Explore Canadian Careers</span>
        </h1>
        <h5>
          Adjust the skill level controls to filter your search.{' '}
          {isTabletOrLarger ? 'Hover over' : 'Click'} a circle to see a result.
        </h5>
      </AppTitleStyles>
    )}
  </MediaQuery>
);

const AppLayoutStyles = styled.div`
position: relative;
  width: 100%;
  display: grid;
  grid-gap: 8px;
  /* Mobile */
  grid-template-rows:auto auto auto 1fr 24px;
  height: 100vh;
  min-height: 890px;
  @media (min-width: 340px) {
  min-height: 750px;
  }
  /* Tablet and up */
  @media (min-width: 400px) {
  overflow: hidden;
    grid-gap: 16px;
    grid-template-rows:auto auto auto 1fr 16px;
  }
  /* @media (min-width: ${TABLET_MIN_WIDTH}px) {
    grid-template-rows: auto auto 1fr auto;
  } */
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
  const [legendVisible, setLegendVisible] = useState(true);
  const {
    getRadiusScale,
    radiusSelector,
    clusterSelector,
    clusterCenters,
    nodes,
    summaryBarsActive,
    zScale,
    colouredByValue,
    uniqueClusterValues,
  } = context.state;

  const { handleResize } = context;

  useEffect(() => {
    const resizeTimer = setInterval(handleResize, RESIZE_INTERVAL_MS);
    return () => clearInterval(resizeTimer);
  }, []);

  const legendColours = uniqueClusterValues.map(val => {
    return { colour: zScale(val), text: val };
  });
  const legendProps = {
    colours: legendColours,
    sizes: [
      { size: 1000, text: '1000 workers' },
      { size: 10000, text: '10000 workers' },
      { size: 100000, text: '100000 workers' },
    ],
    radiusScale: getRadiusScale(),
  };

  return (
    <MediaQuery query={`(min-width: ${TABLET_MIN_WIDTH}px)`}>
      {isTabletOrLarger => (
        <React.Fragment>
          <AppLayoutStyles
            onClick={
              isTabletOrLarger
                ? event => {
                    if (
                      (event.target.classList &&
                        Array.from(event.target.classList).includes(
                          'slidersDiv',
                        )) ||
                      event.target.id === 'svg' ||
                      event.target.nodeName === 'circle'
                    ) {
                      setExpanded(initialExpandedState);
                    }
                  }
                : event => {
                    if (
                      (event.target.classList &&
                        Array.from(event.target.classList).includes(
                          'slidersDiv',
                        )) ||
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
            <AppTitle />
            <FiltersPanel
              filterVariables={filterVariables}
              expanded={expanded}
              setExpanded={setExpanded}
              initialExpandedState={initialExpandedState}
            />
            <SortPanel
              initialExpandedState={initialExpandedState}
              setExpanded={setExpanded}
              setLegendVisible={setLegendVisible}
            />
            <Viz
              isTabletOrLarger={isTabletOrLarger}
              colouredByValue={colouredByValue}
              onMouseMove={
                isTabletOrLarger
                  ? (event, datum) => {
                      const { x, y } = localPoint(
                        event.target.ownerSVGElement,
                        event,
                      );
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
            {legendVisible && <Legend {...legendProps} />}
          </AppLayoutStyles>

          {tooltipProps && isTabletOrLarger && <Tooltip {...tooltipProps} />}
          <MobileTooltip {...mobileTooltipProps} />
        </React.Fragment>
      )}
    </MediaQuery>
  );
};

export default AppLayout;
