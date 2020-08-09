import React, { useEffect, useRef, useState } from "react";
import { getAxisTitleMap } from "../../../utils/constants";
import ContainerDimensions from "react-container-dimensions";
import { AxisStyles, GraphViewAxisTitlesStyles } from "./GraphViewAxisStyles";
import { NUM_TICKS, reScaleAxes } from "../graphViewUtils";
import useStore from "../../store";

const EMPTY_TICKS_ARRAY = new Array(NUM_TICKS).fill("");

const Axis = ({ labels, margins, isXAxis }) => (
  <div className={`axis axis${isXAxis ? "X" : "Y"}`}>
    {EMPTY_TICKS_ARRAY.map((tick, idx) => (
      // key = idx because ticks won't change?
      <div
        key={idx}
        className="tickAndLabelWrapper"
        style={{
          [isXAxis ? "marginLeft" : "marginTop"]:
            idx === 0 ? 0 : margins[isXAxis ? "left" : "top"],
        }}
      >
        <div className="tick" />
        <div className="label">{labels[isXAxis ? "x" : "y"][idx]}</div>
      </div>
    ))}
  </div>
);

const GraphViewAxes = ({ axisValues }) => {
  const nodes = useStore((state) => state.nodes);

  const [margins, setMargins] = useState({ left: 0, top: 0 });
  const [labels, setLabels] = useState({
    x: EMPTY_TICKS_ARRAY,
    y: EMPTY_TICKS_ARRAY,
  });
  // update every second based on remaining nodes
  const timerRef = useRef(null as number | null);
  useEffect(() => {
    timerRef.current = window.setInterval(
      () => reScaleAxes({ axisValues, nodes, setMargins, setLabels }),
      1500
    );
    return () => {
      window.clearInterval(timerRef.current);
    };
  });

  return (
    <>
      <Axis labels={labels} margins={margins} isXAxis={true} />
      <Axis labels={labels} margins={margins} isXAxis={false} />
    </>
  );
};

export default (props) => (
  <AxisStyles className={!props.isGraphView ? "hidden" : ""}>
    <ContainerDimensions>
      {({ width, height }) => (
        <GraphViewAxes {...{ width, height, ...props }} />
      )}
    </ContainerDimensions>
  </AxisStyles>
);

export const GraphViewAxisTitles = ({ isGraphView, axisValues }) => {
  const AXIS_TITLE_MAP = getAxisTitleMap();
  return (
    <GraphViewAxisTitlesStyles>
      <div className={`axisTitle axisTitleX${!isGraphView ? " hidden" : ""}`}>
        {AXIS_TITLE_MAP[axisValues.x.dataLabel]}
      </div>
      <div className={`axisTitle axisTitleY${!isGraphView ? " hidden" : ""}`}>
        <div className="titleWrapper">
          {AXIS_TITLE_MAP[axisValues.y.dataLabel]}
        </div>
      </div>
    </GraphViewAxisTitlesStyles>
  );
};
