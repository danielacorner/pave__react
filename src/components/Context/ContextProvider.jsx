import * as d3 from 'd3';
import debounce from 'lodash.debounce';
import React, { Component } from 'react';
import NOCData from '../../assets/NOC-data';
import FORCE from '../FORCE';
const NOCDataProcessed = NOCData.map(d => {
  d.name = d.job;
  return d;
});

export const ControlsContext = React.createContext();

export const $ = element => document.querySelector(element); // jQuerify

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
      radiusSelector: 'workers',
      clusterSelector: 'industry',
      getRadiusScale: () => {
        const radii = NOCData.map(d => d[this.state.radiusSelector]);
        const radiusRange = [5, 50];
        return d3
          .scaleSqrt() // square root scale because radius of a circle
          .domain([d3.min(radii), d3.max(radii)])
          .range(radiusRange);
      },
      uniqueClusterValues: NOCData.map(d => d['industry']).filter(
        (value, index, self) => self.indexOf(value) === index,
      ),
      clusterCenters: [],
      snapshots: [],
      sortedType: false,
      sortedSize: false,
      colouredByValue: false,
      svgBBox: 0,
      summaryBarsActive: true,
      zScale: d3.scaleOrdinal(d3.schemeCategory10),
    };
  }

  componentDidMount = () => {
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
    const { width, height } = $('#graphContainer').getBoundingClientRect();

    $('#nodesG').style.transform = `translate(${+width / 2}px,${+height /
      2}px)`;
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  // componentDidUpdate(nextProps, nextState) {}

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.nodes !== nextState.nodes;
  }

  translate = () => {
    const { width, height } = $('#graphContainer').getBoundingClientRect();

    const nodesRect = $('#nodesG').getBoundingClientRect();
    const offsetLeft =
      nodesRect.left < 0 && this.state.sortedType ? -nodesRect.left : 0;
    return `${+width / 2 + +offsetLeft}px,${+height / 2}px`;
  };
  scale = () => {
    // resize the graph container to fit the screen
    const { width, height } = $('#graphContainer').getBoundingClientRect();

    // zoom in until you hit the edge of...
    const windowConstrainingLength = this.state.sortedType
      ? // if split into clusters, constrain by the bigger length
        Math.max(width, height) * 0.8
      : // otherwise, constrain by the smaller length
        Math.min(width, height);

    const nodesBB = $('#nodesG').getBBox();
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
  };

  handleResize = debounce(() => {
    const newScale = this.scale();
    const svgBBox = $('#graphContainer').getBoundingClientRect();
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

    // translate the nodes group into the middle and scale to fit
    $(
      '#nodesG',
    ).style.transform = `translate(${this.translate()}) scale(${newScale})`;
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
    // todo: why are circles sometimes visible entering at the center if paused before state change?
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
    const isStrongForce = this.state.sortedSize && this.state.sortedType;
    setTimeout(() => {
      FORCE.restartSimulation(this.state.nodes, isStrongForce);
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
    setTimeout(() => {
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
      },
      () => {
        this.filterNodes();
        this.restartSimulation();
      },
    );
  };
  sortSize = () => {
    const {
      radiusSelector,
      getRadiusScale,
      sortedType,
      uniqueClusterValues,
    } = this.state;
    const sortBy = [];
    if (!this.state.sortedSize) {
      this.setState({ sortedSize: true });
      sortBy.push('size');
    } else {
      this.setState({ sortedSize: false, radiusSelector, getRadiusScale });
    }
    if (sortedType) {
      sortBy.push('type');
    }
    FORCE.applySortForces({
      sortBy,
      getRadiusScale,
      radiusSelector,
      numClusters: uniqueClusterValues.length,
    });
    setTimeout(this.handleResize, 2000);
  };
  sortType = () => {
    const {
      nodes,
      uniqueClusterValues,
      clusterSelector,
      sortedSize,
      sortedType,
      getRadiusScale,
      radiusSelector,
    } = this.state;
    const sortBy = [];
    if (!sortedType) {
      this.setState({ sortedType: true });
      sortBy.push('type');
      setTimeout(() => {
        FORCE.toggleClusterTags(
          true,
          nodes,
          uniqueClusterValues,
          clusterSelector,
        );
        this.handleResize();
      }, 500);
    } else if (sortedType) {
      FORCE.toggleClusterTags(
        false,
        nodes,
        uniqueClusterValues,
        clusterSelector,
      );
      this.setState({ sortedType: false });
      setTimeout(this.handleResize, 1500);
    }
    if (sortedSize) {
      sortBy.push('size');
    }
    FORCE.applySortForces({
      sortBy,
      getRadiusScale,
      radiusSelector,
      numClusters: uniqueClusterValues.length,
    });
  };
  setCurrentColor = variable => {
    this.setState({ colouredByValue: variable });
  };
  colourByValue = variable => {
    if (!this.state.colouredByValue) {
      this.setState({ colouredByValue: variable });
      FORCE.colourByValue({ doColour: true, variable });
    } else {
      this.setState({ colouredByValue: false });
      FORCE.colourByValue({ doColour: false, variable: null });
    }
  };
  toggleSummaryBars = () => {
    console.log(this.state.summaryBarsActive);
    this.setState({ summaryBarsActive: !this.state.summaryBarsActive });
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
          sortSize: this.sortSize,
          sortType: this.sortType,
          colourByValue: this.colourByValue,
          setCurrentColor: this.setCurrentColor,
          toggleSummaryBars: this.toggleSummaryBars,
        }}
      >
        {this.props.children}
      </ControlsContext.Provider>
    );
  }
}

export default ContextProvider;
