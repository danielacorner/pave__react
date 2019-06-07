import * as d3 from 'd3';
import debounce from 'lodash.debounce';
import React, { Component } from 'react';
import NOCData from '../../assets/NOC-data';
import FORCE from '../FORCE';
import { INDUSTRY, WORKERS } from '../Controls/SortPanel';
const NOCDataProcessed = NOCData.map(d => {
  d.name = d.job;
  return d;
});

export const ControlsContext = React.createContext();

export const $ = element => document.querySelector(element); // jQuerify

const getGraphContainerDims = () => {
  const graphContainer = $('#graphContainer');
  return graphContainer
    ? graphContainer.getBoundingClientRect()
    : { width: window.innerWidth, height: window.innerHeight * 0.8 };
};

// TODO: switch to hooks
class ContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        const radii = NOCData.map(d => d[this.state.radiusSelector]);
        const radiusRange = [5, 50];
        return d3
          .scaleSqrt() // square root scale because radius of a circle
          .domain([d3.min(radii), d3.max(radii)])
          .range(radiusRange);
      },
      uniqueClusterValues: NOCData.map(d => d[INDUSTRY]).filter(
        (value, index, self) => self.indexOf(value) === index,
      ),
      clusterCenters: [],
      sortedByValue: false,
      colouredByValue: false,
      svgBBox: 0,
      zScale: d3.scaleOrdinal(d3.schemeCategory10),
      isOffsetTop: false,
      offsetTop: 0,
    };
  }

  componentDidMount() {
    const {
      clusterCenters,
      radiusSelector,
      clusterSelector,
      uniqueClusterValues,
    } = this.state;

    // create clusters arrays
    NOCData.forEach(d => {
      const cluster = uniqueClusterValues.indexOf(d[clusterSelector]) + 1;
      // add to clusters array if it doesn't exist or the radius is larger than any other radius in the cluster
      if (
        !clusterCenters[cluster] ||
        d[radiusSelector] > clusterCenters[cluster][radiusSelector]
      ) {
        clusterCenters[cluster] = d;
        // todo: emit new cluster centers to/from context
        this.setState({ clusterCenters: clusterCenters });
      }
    });

    this.setState({
      zScale: d3.scaleOrdinal(d3.schemeCategory10),
    });
    window.addEventListener('resize', this.handleResize);
    setTimeout(this.handleResize, 1500);

    // tranlate nodes to center

    const { width, height } = getGraphContainerDims();

    const nodesG = $('#nodesG');
    if (nodesG) {
      nodesG.style.transform = `translate(${+width / 2}px,${+height / 2}px)`;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  // componentDidUpdate(nextProps, nextState) {}

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.nodes !== nextState.nodes ||
      this.state.sortedByValue !== nextState.sortedByValue
    );
  }

  getOffsetTop() {
    const graph = $('#graphContainer');
    const graphRect = graph && graph.getBoundingClientRect();
    const nodesG = $('#nodesG');
    const nodesRect = nodesG && nodesG.getBoundingClientRect();

    const newOffsetTop =
      this.state.sortedByValue && nodesRect.bottom > 0.975 * graphRect.bottom
        ? -(nodesRect.bottom - 0.975 * graphRect.bottom)
        : 0;

    this.setState({
      offsetTop: this.state.isOffsetTop ? this.state.offsetTop : newOffsetTop,
      isOffsetTop: this.state.isOffsetTop || newOffsetTop !== 0,
    });

    return this.state.isOffsetTop ? this.state.offsetTop : newOffsetTop;
  }

  getTranslate() {
    const { width, height } = getGraphContainerDims();
    return `${+width / 2}px,${+height / 2 + this.getOffsetTop()}px`;
  }

  getScale() {
    // resize the graph container to fit the screen
    const { width, height } = getGraphContainerDims();

    // zoom in until you hit the edge of...
    const windowConstrainingLength = Math.min(width, height); // constrain by the smaller length

    const nodesG = $('#nodesG');
    const nodesBB = nodesG
      ? nodesG.getBBox()
      : { width: window.innerWidth - 10, height: window.innerHeight * 0.8 };
    // constrain the maximum nodes length
    const nodesConstrainedLength = Math.max(nodesBB.width, nodesBB.height);

    // bugfix: zooming in because initial nodesConstrainedLength = 100, and doesn't resize correctly when browser focus isn't on this tab
    if (
      nodesConstrainedLength === 100 &&
      this.state.nodes.length === this.state.originalData.length
    ) {
      return 0.95;
    }

    const scaleRatio = windowConstrainingLength / nodesConstrainedLength;
    return scaleRatio * 0.95; // zoom out a little extra
  }

  handleResize = debounce(() => {
    const newScale = this.getScale();
    const graphContainer = $('#graphContainer');
    const svgBBox = graphContainer
      ? graphContainer.getBoundingClientRect()
      : { height: window.innerHeight * 0.8 };
    this.setState({
      svgBBox,
    });

    // resize size legend scale
    d3.selectAll('.sizeCircle')
      .style('transform', `scale(${newScale})`)
      .style('opacity', 1 / newScale);
    d3.selectAll('.size').style(
      'padding-bottom',
      `${Math.min(Math.max(newScale - 1, 0) * 40, svgBBox.height / 5)}px`,
    );

    // scale up the spaces between the y axis ticks
    d3.select('.yAxis').style('transform', `scaleY(${newScale})`);
    d3.selectAll('.yAxis .tick').style('transform', `scaleY(${1 / newScale})`);

    // translate the nodes group into the middle and scale to fit
    const nodesG = $('#nodesG');
    if (nodesG) {
      nodesG.style.transform = `translate(${this.getTranslate()}) scale(${newScale})`;
    }
  }, 150);

  filteredNodes = () => {
    // filter the dataset according to the slider state
    const { filters, originalData } = this.state;
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
  };

  filterNodes = () => {
    // pause the simulation if running
    !FORCE.paused && FORCE.stopSimulation();

    this.setState({
      nodes: this.filteredNodes(),
    });
  };

  restartSimulation = () => {
    this.setState({
      nodes: this.filteredNodes(),
    });
    const isStrongForce = this.state.sortedByValue && this.state.sortedType;
    const isMediumForce = this.state.sortedByValue;
    setTimeout(() => {
      FORCE.restartSimulation(this.state.nodes, isStrongForce, isMediumForce);
    }, 200);
    setTimeout(() => {
      this.handleResize();
    }, 1500);
  };

  handleFilterChange = (filter, value) => {
    this.setState(
      {
        filters: { ...this.state.filters, [filter]: value },
      },
      this.filterNodes,
    );
  };
  handleFilterMouseup = () => {
    this.setState({
      isOffsetTop: false, // recalculate offsetTop after each filter
      // offsetTop: 0,
    });
    setTimeout(() => {
      // TODO: instead of actually moving the filters, could set the background fill instead?
      // set all filters to new minima on mouseup
      // let newMinima = {};
      // Object.keys(this.state.filters).forEach(filter => {
      //   newMinima[filter] = Math.min(...this.state.nodes.map(d => d[filter]));
      // });
      // restart the simulation
      // this.setState({ filters: newMinima },
      this.restartSimulation();
      // );
    }, 0);
  };
  resetFilters = () => {
    const filtersReset = this.state.filters;
    Object.keys(this.state.filters).map(key => (filtersReset[key] = 0));
    this.setState(
      {
        filters: filtersReset,
        offsetTop: 0,
        isOffsetTop: false,
      },
      () => {
        this.filterNodes();
        this.restartSimulation();
      },
    );
  };
  sortByValue = (value, doSort = false) => {
    const { radiusSelector, getRadiusScale } = this.state;
    const newSortedValue = this.state.sortedByValue && !doSort ? false : value;
    this.setState({ sortedByValue: newSortedValue });
    FORCE.applySortForces({
      sortByValue: newSortedValue,
      getRadiusScale,
      radiusSelector,
    });
    setTimeout(this.handleResize, 2000);
  };
  setCurrentColor = value => {
    this.setState({ colouredByValue: value });
  };
  colourByValue = value => {
    if (!this.state.colouredByValue) {
      this.setState({ colouredByValue: value });
      FORCE.colourByValue({ doColour: true, value });
    } else {
      this.setState({ colouredByValue: false });
      FORCE.colourByValue({ doColour: false, value: null });
    }
  };
  render() {
    return (
      <ControlsContext.Provider
        value={{
          state: this.state,
          setRadiusSelector: x => this.setState({ radiusSelector: x }),
          setClusterSelector: x => this.setState({ clusterSelector: x }),
          handleFilterChange: this.handleFilterChange,
          handleResize: this.handleResize,
          resetFilters: this.resetFilters,
          restartSimulation: this.restartSimulation,
          handleFilterMouseup: this.handleFilterMouseup,
          setNodes: nodes => this.setState({ nodes: nodes }),
          sortByValue: this.sortByValue,
          colourByValue: this.colourByValue,
          setCurrentColor: this.setCurrentColor,
        }}
      >
        {this.props.children}
      </ControlsContext.Provider>
    );
  }
}

export default ContextProvider;
