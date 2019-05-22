// import queryString from 'query-string'
// import { localPoint } from '@vx/event';
import React, { useContext, useState, useEffect, useRef } from 'react';
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

import FORCE from './FORCE';
import { useWindowSize } from './useWindowSize';
import { NAV_HEIGHT } from './Nav/Navbar';

const AppLayoutStyles = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-gap: 8px;
  /* Mobile */
  grid-template-rows: auto auto 1fr auto;
  min-height: 740px;
  @media (min-width: 340px) {
    min-height: 750px;
  }
  /* Tablet and up */
  @media (min-width: 400px) {
    height: calc(100vh - ${NAV_HEIGHT}px);
    overflow: hidden;
    grid-gap: 16px;
  }
  /* @media (min-width: ${TABLET_MIN_WIDTH}px) {
    grid-template-rows: auto auto 1fr auto;
  } */
  padding: 10px 10px 0 10px;
  @media (min-width: 400px) {
    padding: 10px 20px 0 20px;
  }
  box-sizing: border-box;
  `;

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp',
];

const AppLayout = ({ location }) => {
  const { innerHeight } = useWindowSize();
  const [tooltipProps, setTooltipProps] = useState(null);
  const [mobileTooltipProps, setMobileTooltipProps] = useState(null);
  const [isTooltipActive, setIsTooltipActive] = useState(null);
  const {
    state,
    handleResize,
    restartSimulation,
    handleLoadFromSnapshot,
  } = useContext(ControlsContext);
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
  } = state;

  useEffect(() => {
    window.addEventListener('mouseup', () => {
      if (FORCE.paused) {
        restartSimulation();
      }
    });
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
      { size: 50000, text: '50000 workers' },
    ],
    radiusScale: getRadiusScale(),
  };

  const tooltipTimer = useRef();

  const TOOLTIP_DURATION = 500;
  const TOOLTIP_FADEOUT = 500;

  const startTooltipActive = () => {
    clearTimeout(tooltipTimer.current);
    if (!isTooltipActive) {
      setIsTooltipActive(true);
    }
  };
  const stopTooltipActive = () => {
    tooltipTimer.current = setTimeout(() => {
      const tooltip = document.querySelector('.mouseoverTooltip');
      tooltip && tooltip.classList.add('fadeOut');
      setTimeout(() => {
        setIsTooltipActive(false);
        setTooltipProps(null);
      }, TOOLTIP_FADEOUT);
    }, TOOLTIP_DURATION);
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
                      // const { x,y } = localPoint(
                      //   event.target.ownerSVGElement,
                      //   event,
                      // );
                      const {
                        bottom,
                        height,
                        left,
                        width,
                      } = event.target.getBoundingClientRect();

                      const tooltipProps = {
                        data: datum,
                        bottom: innerHeight - bottom + height / 2,
                        left: left + width / 2 + 20,
                        width,
                      };
                      setTooltipProps(tooltipProps);
                      startTooltipActive();
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
              onMouseOut={isTabletOrLarger ? stopTooltipActive : () => {}}
              filtersQuery={location.search}
              onLoadFromSnapshot={ssUrl => handleLoadFromSnapshot(ssUrl)}
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

          {isTooltipActive && isTabletOrLarger && <Tooltip {...tooltipProps} />}
          <MobileTooltip {...mobileTooltipProps} />
        </React.Fragment>
      )}
    </MediaQuery>
  );
};

export default AppLayout;
