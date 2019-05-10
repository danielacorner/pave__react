// import queryString from 'query-string'
import { localPoint } from '@vx/event';
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
import { Button } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/MessageRounded';
import { FeedbackForm } from './FeedbackForm';
import FORCE from './FORCE';

const AppTitleStyles = styled.div`
  background: white;
  position: relative;
  font-family: system-ui;
  margin: 8px 12px 0 12px;
  h1.title {
    max-width: 500px;
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

const AppTitle = () => {
  return (
    <MediaQuery query={`(min-width: ${TABLET_MIN_WIDTH}px)`}>
      {isTabletOrLarger => (
        <AppTitleStyles>
          <div>
            <h1 className="title">
              Goodjob 🎈 <span>Explore Canadian Careers</span>
            </h1>
            <h5>
              Adjust the skill level controls to filter your search.{' '}
              {isTabletOrLarger ? 'Hover over' : 'Click'} a circle to see a
              result.
            </h5>
          </div>
        </AppTitleStyles>
      )}
    </MediaQuery>
  );
};

const AppLayoutStyles = styled.div`
 .btnFeedback {
    background: white;
    text-transform: none;
    position: absolute;
    top: 20px;
    right: 20px;
    span {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 5px;
    }
  }
  position: relative;
  width: 100%;
  display: grid;
  grid-gap: 8px;
  /* Mobile */
  grid-template-rows:auto auto auto 1fr 34px;
  height: 100vh;
  min-height: 890px;
  @media (min-width: 340px) {
    min-height: 750px;
  }
  /* Tablet and up */
  @media (min-width: 400px) {
    overflow: hidden;
    grid-gap: 16px;
    grid-template-rows:auto auto auto 1fr 26px;
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
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
        setIsTooltipActive(false), setTooltipProps(null);
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
            <AppTitle />
            <Button
              onClick={() => setIsFeedbackOpen(true)}
              className="btnFeedback"
            >
              Feedback <MessageIcon />
            </Button>
            {isFeedbackOpen && (
              <FeedbackForm setIsFeedbackOpen={setIsFeedbackOpen} />
            )}
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
              filtersQuery={props.location.search}
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
