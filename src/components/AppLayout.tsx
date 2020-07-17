// import queryString from 'query-string'
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import styled from "styled-components/macro";
import {
  TABLET_MIN_WIDTH,
  RESIZE_INTERVAL_MS,
  SKILLS_LANG,
  SKILLS_LOGI,
  SKILLS_COMP,
  SKILLS_MATH,
} from "../utils/constants";
import { ControlsContext } from "./Context/ContextProvider";
import FiltersPanel from "./Controls/FiltersPanel";
import SortPanel, {
  STUDY,
  SALARY,
  STUDY_LABEL,
  SALARY_LABEL,
} from "./Controls/SortPanel";
import MobileTooltip from "./Viz/MobileTooltip";
import Tooltip from "./Viz/Tooltip";
import Viz from "./Viz/Viz";
import Legend from "./Viz/Legend";

import FORCE from "./FORCE";
import { useWindowSize } from "./useWindowSize";
import { NAV_HEIGHT } from "./Nav/Navbar";
import ContainerDimensions from "react-container-dimensions";

const AppLayoutStyles = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-gap: 8px;
  /* Mobile */
  grid-template-rows: auto auto 1fr auto;
  min-height: 620px;
  &.sorted {
    min-height: 666px;
  }
  @media (min-width: 340px) {
    min-height: 695px;
    /* TODO: expand vertically when sorted vertically by something... */
    &.sorted {
      min-height: 800px;
    }
  }
  /* Tablet and up */
  padding: 10px 10px 0 10px;
  @media (min-width: 400px) {
    height: calc(100vh - ${NAV_HEIGHT}px);
    overflow: hidden;
    grid-gap: 16px;
    padding: 10px 20px 0 20px;
  }
  box-sizing: border-box;
`;
export const INITIAL_SUBSKILL_FILTERS_EXPANDED_STATE = {
  skillsLang: false,
  skillsLogi: false,
  skillsMath: false,
  skillsComp: false,
};
const filterVariables = [SKILLS_LANG, SKILLS_LOGI, SKILLS_MATH, SKILLS_COMP];

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

const AppLayout = () => {
  const { innerHeight } = useWindowSize();
  const [tooltipProps, setTooltipProps] = useState(
    emptyTooltipProps as TooltipProps | null
  );
  const [isTooltipExpanded, setIsTooltipExpanded] = useState(false);
  const [mobileTooltipProps, setMobileTooltipProps] = useState(
    emptyMobileTooltipProps as MobileTooltipProps | null
  );
  const [isTooltipActive, setIsTooltipActive] = useState(
    null as boolean | null
  );
  const [axisValues, setAxisValues] = useState({
    x: { displayName: STUDY, dataLabel: STUDY_LABEL },
    y: { displayName: SALARY, dataLabel: SALARY_LABEL },
  });
  const { state, handleResize, restartSimulation } = useContext(
    ControlsContext
  );

  const [isExpanded, setIsExpanded] = useState(
    INITIAL_SUBSKILL_FILTERS_EXPANDED_STATE
  );
  const { getRadiusScale, zScale, uniqueClusterValues, sortedByValue } = state;

  const [isGraphView, setIsGraphView] = useState(false);

  const prevPositions = useRef({});

  const onMouseUp = useCallback(() => {
    if ((FORCE as any).paused && !isGraphView) {
      restartSimulation();
    }
  }, [isGraphView, restartSimulation]);

  useEffect(() => {
    if (!isGraphView) {
      window.addEventListener("mouseup", onMouseUp);
    }
    const resizeTimer = setInterval(
      handleResize,
      isGraphView ? RESIZE_INTERVAL_MS : 1000
    );
    return () => {
      clearInterval(resizeTimer);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleResize, restartSimulation, isGraphView, onMouseUp]);

  const legendColours = uniqueClusterValues.map((val: number) => {
    return { colour: zScale(val), text: val };
  });

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
      const tooltip = document.querySelector(".mouseoverTooltip");
      tooltip && tooltip.classList.add("fadeOut");
      window.setTimeout(() => {
        setIsTooltipActive(false);
        setIsTooltipExpanded(false);
        setTooltipProps(null);
      }, TOOLTIP_FADEOUT);
    }, TOOLTIP_DURATION);
  };

  const isTabletOrLarger = useMediaQuery(`(min-width: ${TABLET_MIN_WIDTH}px)`);

  return (
    <>
      <AppLayoutStyles
        className={sortedByValue ? "sorted" : ""}
        onClick={
          isTabletOrLarger
            ? (event) => {
                if (
                  ((event.target as HTMLElement).classList &&
                    Array.from(
                      (event.target as HTMLElement).classList
                    ).includes("slidersDiv")) ||
                  (event.target as HTMLElement).id === "svg" ||
                  (event.target as HTMLElement).nodeName === "circle"
                ) {
                  setIsExpanded(INITIAL_SUBSKILL_FILTERS_EXPANDED_STATE);
                }
              }
            : (event) => {
                if (
                  ((event.target as HTMLElement).classList &&
                    Array.from(
                      (event.target as HTMLElement).classList
                    ).includes("slidersDiv")) ||
                  (event.target as HTMLElement).id === "svg" ||
                  (event.target as HTMLElement).nodeName === "circle"
                ) {
                  setIsExpanded(INITIAL_SUBSKILL_FILTERS_EXPANDED_STATE);
                }
                if ((event.target as HTMLElement).nodeName !== "circle") {
                  setMobileTooltipProps(null);
                }
              }
        }
      >
        <FiltersPanel
          filterVariables={filterVariables}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        <SortPanel
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          isGraphView={isGraphView}
          setIsGraphView={setIsGraphView}
          axisValues={axisValues}
          setAxisValues={setAxisValues}
          prevPositions={prevPositions}
        />
        <ContainerDimensions>
          {({ width, height }) => (
            <Viz
              onMouseMoveNode={
                isTabletOrLarger
                  ? (event: Event, datum: any) => {
                      const {
                        bottom,
                        height,
                        left,
                        width,
                      } = (event.target as HTMLElement).getBoundingClientRect();

                      setTooltipProps({
                        data: datum,
                        bottom: (innerHeight || 0) - bottom + height / 2,
                        left: left + width / 2 + 20,
                        width,
                      });
                      startTooltipActive();
                    }
                  : () => {}
              }
              onClickNode={
                isTabletOrLarger
                  ? () => {
                      setIsTooltipExpanded(true);
                      console.log("🌟🚨: AppLayout -> setIsTooltipExpanded");
                    }
                  : (event: Event, datum: any) => {
                      const {
                        width,
                      } = (event.target as HTMLElement).getBoundingClientRect();
                      const mobileTooltipProps = {
                        data: datum,
                        width,
                      };
                      setMobileTooltipProps(mobileTooltipProps);
                    }
              }
              onMouseOutNode={isTabletOrLarger ? stopTooltipActive : () => null}
              isGraphView={isGraphView}
              isTabletOrLarger={isTabletOrLarger}
              axisValues={axisValues}
              width={width}
              height={height}
              prevPositions={prevPositions}
            />
          )}
        </ContainerDimensions>
        <Legend
          colours={legendColours}
          sizes={[
            { size: 1000, text: "1000 workers" },
            { size: 10000, text: "10000 workers" },
            { size: 50000, text: "50000 workers" },
          ]}
          radiusScale={getRadiusScale()}
          isGraphView={isGraphView}
        />
      </AppLayoutStyles>

      {isTooltipActive && isTabletOrLarger ? (
        <Tooltip
          isTooltipExpanded={isTooltipExpanded}
          {...(tooltipProps || emptyTooltipProps)}
        />
      ) : (
        <MobileTooltip {...(mobileTooltipProps || emptyMobileTooltipProps)} />
      )}
    </>
  );
};

export default AppLayout;
