// import queryString from 'query-string'
import React, { useContext, useState, useEffect, useRef } from 'react';
import { unstable_useMediaQuery } from '@material-ui/core/useMediaQuery';
import styled from 'styled-components';
import {
  TABLET_MIN_WIDTH,
  RESIZE_INTERVAL_MS,
  SKILLS_LANG,
  SKILLS_LOGI,
  SKILLS_COMP,
  SKILLS_MATH,
} from '../utils/constants';
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
  min-height: 620px;
  @media (min-width: 340px) {
    min-height: 695px;
    /* TODO: expand vertically when sorted vertically by something... */
    &.sorted {
      min-height: 800px;
    }
  }
  /* Tablet and up */
  @media (min-width: 400px) {
    height: calc(100vh - ${NAV_HEIGHT}px);
    overflow: hidden;
    grid-gap: 16px;
  }
  padding: 10px 10px 0 10px;
  @media (min-width: 400px) {
    padding: 10px 20px 0 20px;
  }
  box-sizing: border-box;
`;

const filterVariables = [SKILLS_LANG, SKILLS_LOGI, SKILLS_MATH, SKILLS_COMP];

interface AppLayoutProps {
  path: string;
}
interface TooltipProps {
  data: any;
  bottom: number;
  left: number;
  width: number;
}
interface MobileTooltipProps {
  data: any;
  width: number;
}
const emptyTooltipProps = {
  data: null,
  bottom: 0,
  left: 0,
  width: 0,
};
const emptyMobileTooltipProps = {
  data: null,
  width: 0,
};

const AppLayout = ({ path }: AppLayoutProps) => {
  console.log({ path });
  const { innerHeight } = useWindowSize();
  const [tooltipProps, setTooltipProps] = useState(
    emptyTooltipProps as TooltipProps | null,
  );
  const [mobileTooltipProps, setMobileTooltipProps] = useState(
    emptyMobileTooltipProps as MobileTooltipProps | null,
  );
  const [isTooltipActive, setIsTooltipActive] = useState(null as
    | boolean
    | null);
  const { state, handleResize, restartSimulation } = useContext(
    ControlsContext,
  );
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
    colouredByValue,
    uniqueClusterValues,
  } = state;

  useEffect(() => {
    window.addEventListener('mouseup', () => {
      if ((FORCE as any).paused) {
        restartSimulation();
      }
    });
    const resizeTimer = setInterval(handleResize, RESIZE_INTERVAL_MS);
    return () => clearInterval(resizeTimer);
  }, [handleResize, restartSimulation]);

  const legendColours = uniqueClusterValues.map((val: number) => {
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

  const tooltipTimer = useRef(null as number | null);

  const TOOLTIP_DURATION = 500;
  const TOOLTIP_FADEOUT = 500;

  const startTooltipActive = () => {
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current);
    }
    if (!isTooltipActive) {
      setIsTooltipActive(true);
    }
  };
  const stopTooltipActive = () => {
    tooltipTimer.current = window.setTimeout(() => {
      const tooltip = document.querySelector('.mouseoverTooltip');
      tooltip && tooltip.classList.add('fadeOut');
      window.setTimeout(() => {
        setIsTooltipActive(false);
        setTooltipProps(null);
      }, TOOLTIP_FADEOUT);
    }, TOOLTIP_DURATION);
  };

  const isTabletOrLarger = unstable_useMediaQuery(
    `(min-width: ${TABLET_MIN_WIDTH}px)`,
  );

  return (
    <>
      <AppLayoutStyles
        onClick={
          isTabletOrLarger
            ? event => {
                if (
                  ((event.target as HTMLElement).classList &&
                    Array.from(
                      (event.target as HTMLElement).classList,
                    ).includes('slidersDiv')) ||
                  (event.target as HTMLElement).id === 'svg' ||
                  (event.target as HTMLElement).nodeName === 'circle'
                ) {
                  setExpanded(initialExpandedState);
                }
              }
            : event => {
                if (
                  ((event.target as HTMLElement).classList &&
                    Array.from(
                      (event.target as HTMLElement).classList,
                    ).includes('slidersDiv')) ||
                  (event.target as HTMLElement).id === 'svg' ||
                  (event.target as HTMLElement).nodeName === 'circle'
                ) {
                  setExpanded(initialExpandedState);
                }
                if ((event.target as HTMLElement).nodeName !== 'circle') {
                  setMobileTooltipProps(null);
                }
              }
        }
      >
        <FiltersPanel
          filterVariables={filterVariables}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        <SortPanel
          initialExpandedState={initialExpandedState}
          setExpanded={setExpanded}
        />
        <Viz
          isTabletOrLarger={isTabletOrLarger}
          colouredByValue={colouredByValue}
          onMouseMove={
            isTabletOrLarger
              ? (event: Event, datum: any) => {
                  const {
                    bottom,
                    height,
                    left,
                    width,
                  } = (event.target as HTMLElement).getBoundingClientRect();

                  const tooltipProps = {
                    data: datum,
                    bottom: (innerHeight || 0) - bottom + height / 2,
                    left: left + width / 2 + 20,
                    width,
                  };
                  setTooltipProps(tooltipProps);
                  startTooltipActive();
                }
              : () => {}
          }
          onClick={
            !isTabletOrLarger
              ? (event: Event, datum: any) => {
                  const {
                    width,
                  } = (event.target as HTMLElement).getBoundingClientRect();
                  console.log({ width });
                  const mobileTooltipProps = {
                    data: datum,
                    width,
                  };
                  console.log({ mobileTooltipProps });
                  setMobileTooltipProps(mobileTooltipProps);
                }
              : () => {}
          }
          onMouseOut={isTabletOrLarger ? stopTooltipActive : () => {}}
          radiusScale={getRadiusScale()}
          radiusSelector={radiusSelector}
          clusterSelector={clusterSelector}
          clusterCenters={clusterCenters}
          nodes={nodes}
          summaryBarsActive={summaryBarsActive}
          zScale={zScale}
        />
        <Legend {...legendProps} />
      </AppLayoutStyles>

      {isTooltipActive && isTabletOrLarger ? (
        <Tooltip {...tooltipProps || emptyTooltipProps} />
      ) : (
        <MobileTooltip {...mobileTooltipProps || emptyMobileTooltipProps} />
      )}
    </>
  );
};

export default AppLayout;
