import create from "zustand";
import NOCData from "../assets/NOC-data";
import { WORKERS, INDUSTRY } from "../utils/constants";
import * as d3 from "d3";
import FORCE from "./FORCE";
import { uniq } from "lodash";

export const $ = (element) => document.querySelector(element); // jQuerify

const getGraphContainerDims = () => {
  const graphContainer = $("#graphContainer");
  return graphContainer
    ? graphContainer.getBoundingClientRect()
    : { width: window.innerWidth, height: window.innerHeight * 0.8 };
};

const NOCDataProcessed = NOCData.map((d) => {
  d.name = d.job;
  return d;
});

const [useStore] = create((set, get) => ({
  originalData: NOCDataProcessed,
  nodes: NOCDataProcessed,
  filters: {
    skillsLang: 0,
    skillsLogi: 0,
    skillsMath: 0,
    skillsComp: 0,
    s1DataAnalysis: 0,
    s2DecisionMaking: 0,
    s3FindingInformation: 0,
    s4JobTaskPlanningandOrganizing: 0,
    s5MeasurementandCalculation: 0,
    s6MoneyMath: 0,
    s7NumericalEstimation: 0,
    s8OralCommunication: 0,
    s9ProblemSolving: 0,
    s10Reading: 0,
    s11SchedulingorBudgetingandAccounting: 0,
    s12DigitalTechnology: 0,
    s13DocumentUse: 0,
    s14Writing: 0,
    s15CriticalThinking: 0,
  },
  radiusSelector: WORKERS,
  clusterSelector: INDUSTRY,
  getRadiusScale: () => {
    const radii = NOCData.map((d) => d[get().radiusSelector]);
    const radiusRange = [5, 50];
    return d3
      .scaleSqrt() // square root scale because radius of a circle
      .domain([d3.min(radii), d3.max(radii)])
      .range(radiusRange);
  },
  uniqueClusterValues: uniq(NOCData.map((d) => d.industry)),
  clusterCenters: [],
  sortedByValue: false,
  colouredByValue: false,
  svgBBox: 0,
  zScale: d3.scaleOrdinal(d3.schemeCategory10),
  isOffsetTop: false,
  offsetTop: 0,

  initializeClusterCenters: () =>
    set((state) => {
      console.log("🌟🚨: state", state);
      let clusterCenters = [];

      // create clusters arrays
      NOCData.forEach((d) => {
        const cluster =
          state.uniqueClusterValues.indexOf(d[state.clusterSelector]) + 1;
        // add to clusters array if it doesn't exist or the radius is larger than any other radius in the cluster
        if (
          !clusterCenters[cluster] ||
          d[state.radiusSelector] >
            clusterCenters[cluster][state.radiusSelector]
        ) {
          clusterCenters[cluster] = d;
        }
      });
      console.log("🌟🚨: clusterCenters", clusterCenters);

      window.addEventListener("resize", get().handleResize);
      setTimeout(get().handleResize, 1500);

      // tranlate nodes to center

      const { width, height } = getGraphContainerDims();

      const nodesG = $("#nodesG");
      if (nodesG) {
        nodesG.style.transform = `translate(${+width / 2}px,${+height / 2}px)`;
      }

      return { clusterCenters, zScale: d3.scaleOrdinal(d3.schemeCategory10) };
    }),

  handleResize: () =>
    set((state) => {
      if ((FORCE as any).isGraphView) {
        return;
      }
      const newScale = get().getScale();
      const graphContainer = $("#graphContainer");
      const svgBBox = graphContainer
        ? graphContainer.getBoundingClientRect()
        : { height: window.innerHeight * 0.8 };

      // resize size legend scale
      d3.selectAll(".sizeCircle")
        .style("transform", `scale(${newScale})`)
        .style("opacity", 1 / newScale);
      d3.selectAll(".size").style(
        "padding-bottom",
        `${Math.min(Math.max(newScale - 1, 0) * 40, svgBBox.height / 5)}px`
      );

      // scale up the spaces between the y axis ticks
      d3.select(".yAxis").style("transform", `scaleY(${newScale})`);
      d3.selectAll(".yAxis .tick").style(
        "transform",
        `scaleY(${1 / newScale})`
      );

      // translate the nodes group into the middle and scale to fit
      const nodesG = $("#nodesG");
      if (nodesG) {
        nodesG.style.transform = `translate(${get().getTranslate()}) scale(${newScale})`;
      }
      return {
        svgBBox,
      };
    }),
  getOffsetTop: () =>
    set((state) => {
      const graph = $("#graphContainer");
      const graphRect = graph && graph.getBoundingClientRect();
      const nodesG = $("#nodesG");
      const nodesRect = nodesG && nodesG.getBoundingClientRect();

      const newOffsetTop =
        state.sortedByValue && nodesRect.bottom > 0.975 * graphRect.bottom
          ? -(nodesRect.bottom - 0.975 * graphRect.bottom)
          : 0;

      return {
        offsetTop: state.isOffsetTop ? state.offsetTop : newOffsetTop,
        isOffsetTop: state.isOffsetTop || newOffsetTop !== 0,
      };
    }),
  getTranslate: () =>
    set((state) => {
      const { width, height } = getGraphContainerDims();
      get().getOffsetTop();
      return `${+width / 2}px,${+height / 2 + state.offsetTop}px`;
    }),

  getScale: () =>
    set((state) => {
      if ((FORCE as any).isGraphView) {
        return 0.36;
      }
      // resize the graph container to fit the screen
      const { width, height } = getGraphContainerDims();

      // zoom in until you hit the edge of...
      const windowConstrainingLength = Math.min(width, height); // constrain by the smaller length

      const nodesG = $("#nodesG");
      const nodesBB = nodesG
        ? nodesG.getBBox()
        : { width: window.innerWidth - 10, height: window.innerHeight * 0.8 };
      // constrain the maximum nodes length
      const nodesConstrainedLength = Math.max(nodesBB.width, nodesBB.height);

      // bugfix: zooming in because initial nodesConstrainedLength = 100, and doesn't resize correctly when browser focus isn't on this tab
      if (
        nodesConstrainedLength === 100 &&
        state.nodes.length === state.originalData.length
      ) {
        return 0.95;
      }

      const scaleRatio = windowConstrainingLength / nodesConstrainedLength;

      return scaleRatio * 0.95; // zoom out a little extra
    }),

  filteredNodes: () => {
    // filter the dataset according to the slider state
    const { filters, originalData } = get();
    const filterKeys = Object.keys(filters);
    const numFilters = filterKeys.length;
    const numNodes = originalData.length;

    const filtered = [];
    for (let i = 0; i < numNodes; i++) {
      const node = originalData[i];
      let keep = true;
      // for each filter variable
      for (let i = 0; i < numFilters; i++) {
        const filterVar = filterKeys[i]; // 'skillsLang', 'skillsMath'...
        // filter out the node if less than the slider value
        if (node[filterVar] < filters[filterVar]) {
          keep = false;
        }
      }
      keep && filtered.push(node);
    }
    return filtered;
  },

  filterNodes: () =>
    set((state) => {
      // pause the simulation if running
      !(FORCE as any).paused && (FORCE as any).stopSimulation();

      return {
        nodes: state.filteredNodes(),
      };
    }),

  restartSimulation: () =>
    set((state) => {
      const isStrongForce = state.sortedByValue && state.sortedType;
      const isMediumForce = state.sortedByValue;
      setTimeout(() => {
        (FORCE as any).restartSimulation(
          state.nodes,
          isStrongForce,
          isMediumForce
        );
      }, 200);
      setTimeout(() => {
        state.handleResize();
      }, 1500);
      return {
        nodes: state.filteredNodes(),
      };
    }),

  handleFilterChange: (filter, value) =>
    set((state) => {
      state.filterNodes(); // TODO: useEffect to filter when filters change (AFTER not before)
      return {
        filters: { ...state.filters, [filter]: value },
      };
    }),

  handleFilterMouseup: () =>
    set((state) => {
      if (!(FORCE as any).isGraphView) {
        setTimeout(() => {
          // TODO: instead of actually moving the filters, could set the background fill instead?
          // set all filters to new minima on mouseup
          // let newMinima = {};
          // Object.keys(this.state.filters).forEach(filter => {
          //   newMinima[filter] = Math.min(...this.state.nodes.map(d => d[filter]));
          // });
          // restart the simulation
          // this.setState({ filters: newMinima },
          state.restartSimulation();
          // );
        }, 0);
      }
      return {
        isOffsetTop: false, // recalculate offsetTop after each filter
        // offsetTop: 0,
      };
    }),

  resetFilters: () => {
    setTimeout(() => {
      get().filterNodes();
      get().restartSimulation();
    }, 0);
    return set((state) => {
      const filtersReset = state.filters;
      Object.keys(state.filters).map((key) => (filtersReset[key] = 0));
      return {
        filters: filtersReset,
        offsetTop: 0,
        isOffsetTop: false,
      };
    });
  },
  sortByValue: (value, doSort = false) => {
    const {
      radiusSelector,
      getRadiusScale,
      sortedByValue,
      handleResize,
    } = get();
    const newSortedValue = sortedByValue && !doSort ? false : value;
    (FORCE as any).applySortForces({
      sortByValue: newSortedValue,
      getRadiusScale,
      radiusSelector,
    });
    setTimeout(handleResize, 2000);

    return set((state) => ({ sortedByValue: newSortedValue }));
  },
  setCurrentColor: (value) => set((state) => ({ colouredByValue: value })),
  colourByValue: (value) =>
    set((state) => {
      if (!state.colouredByValue) {
        (FORCE as any).colourByValue({ doColour: true, value });
        return { colouredByValue: value };
      } else {
        (FORCE as any).colourByValue({ doColour: false, value: null });
        return { colouredByValue: false };
      }
    }),

  setRadiusSelector: (x) => set((state) => ({ radiusSelector: x })),

  setClusterSelector: (x) => set((state) => ({ clusterSelector: x })),

  setNodes: (nodes) => set((state) => ({ nodes: nodes })),
}));

export default useStore;
