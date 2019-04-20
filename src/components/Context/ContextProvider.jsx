import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';
import html2canvas from 'html2canvas';
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
      sortedColour: false,
      sortedSize: false,
      colouredByValue: false,
      svgBBox: 0,
      summaryBarsActive: true,
      zScale: scaleOrdinal({
        domain: [],
        range: ['#6c5efb', '#c998ff', '#a44afe'],
      }),
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
      // if ([1, 100, 200, 300, 400].includes(d.id)) {
      // }
    });

    // set the color scale based on the unique clusters
    const keys = NOCDataProcessed.map(d => d[clusterSelector]).filter(
      (value, index, self) => self.indexOf(value) === index,
    );
    this.setState({
      zScale: scaleOrdinal({
        domain: keys,
        // TODO: check this range? should it be in constants.jsx?
        range: ['#6c5efb', '#c998ff', '#a44afe'],
      }),
    }),
      window.addEventListener('resize', this.handleResize);
    setTimeout(this.handleResize, 1500);

    // tranlate nodes to center
    const [width, height] = [
      $('#svg').getBoundingClientRect().width,
      $('#graphContainer').getBoundingClientRect().height,
    ];

    $('#nodesG').style.transform = `translate(${width / 2}px,${height / 2}px)`;
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  // componentDidUpdate(nextProps, nextState) {}

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.nodes !== nextState.nodes;
  }

  translate = () => {
    const [width, height] = [
      $('#svg').getBoundingClientRect().width,
      $('#graphContainer').getBoundingClientRect().height,
    ];
    return `${width / 2}px,${height / 2}px`;
  };
  scale = () => {
    // resize the graph container to fit the screen
    const [width, height] = [
      $('#svg').getBoundingClientRect().width,
      $('#graphContainer').getBoundingClientRect().height,
    ];

    // zoom in until you hit the edge of...
    const windowConstrainingLength = this.state.sortedColour
      ? // if split into clusters, constrain by the bigger length
        Math.max(width, height)
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
    // console.count('...resizing...');
    // recalculate the svg height (to resize the statistic bars)
    this.setState({
      svgBBox: $('#svg').getBoundingClientRect(),
    });
    // translate the nodes group into the middle and scale to fit
    $(
      '#nodesG',
    ).style.transform = `translate(${this.translate()}) scale(${this.scale()})`;
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
    setTimeout(() => {
      FORCE.restartSimulation(this.state.nodes);
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
    let newMinima = {};
    // set all filters to new minima on mouseup
    setTimeout(() => {
      Object.keys(this.state.filters).forEach(filter => {
        // console.log(Math.max(...this.state.nodes[filter]));
        newMinima[filter] = Math.min(...this.state.nodes.map(d => d[filter]));
      });
      // restart the simulation
      this.setState({ filters: newMinima }, this.restartSimulation());
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
  handleSnapshot = () => {
    const gc = $('#graphContainer');
    html2canvas(
      gc,
      // options
      {
        // x: $('#nodesG').getBoundingClientRect().x,
        // y: $('#nodesG').getBoundingClientRect().y,
        // width: $('#nodesG').getBoundingClientRect().width,
        // height: $('#nodesG').getBoundingClientRect()
        //   .height,
        // scrollX: $('#nodesG').getBoundingClientRect().left,
        // scrollY: $('#nodesG').getBoundingClientRect().top,
        onclone: document => {
          $('#nodesG').style.transform =
            // todo: calculate this (output canvas snapshot isn't the right scale)
            `translate(150px,100px) scale(${this.scale() * 0.5})`;
        },
      },
    ).then(canvas => {
      // $(
      //   '#nodesG'
      // ).style.transform = `translate(0,0) scale(${this.scale()})`;

      let imgData = canvas.toDataURL();

      const ssID = this.state.snapshots.length;
      const newSnapshot = {
        id: ssID,
        filters: this.state.filters,
        image: imgData,
      };

      this.setState({ snapshots: [...this.state.snapshots, newSnapshot] });

      localStorage.setItem(
        'snapshots',
        JSON.stringify([...this.state.snapshots, newSnapshot]),
      );

      setTimeout(this.handleResize, 1500);
    });
  };

  handleApplySnapshot = id => {
    console.log(
      'applying snapshot ',
      this.state.snapshots.find(ss => ss.id === id),
    );
    const snapshot = this.state.snapshots.find(ss => ss.id === id);
    this.setState({ filters: snapshot.filters });
    this.handleFilterMouseup();
  };
  handleLoadFromSnapshot = ssUrl => {
    setTimeout(() => {
      this.setState({ filters: JSON.parse(ssUrl) });
      this.restartSimulation();
    }, 2000);
  };
  handleDeleteSnapshot = id => {
    const deleteIndex = this.state.snapshots.findIndex(ss => ss.id === id);
    console.log('deleting', deleteIndex);
    this.setState({
      snapshots: [
        ...this.state.snapshots.slice(0, deleteIndex),
        ...this.state.snapshots.slice(deleteIndex + 1),
      ],
    });
  };

  sortSize = () => {
    const { radiusSelector, getRadiusScale, sortedColour } = this.state;
    if (!this.state.sortedSize) {
      this.setState({ sortedSize: true });
      // split the view into sections for each cluster
      FORCE.sortSize({
        sorted: true,
        radiusSelector,
        getRadiusScale,
        sortedColour,
      });
      // FORCE.restartSimulation(nodes);
    } else {
      FORCE.sortSize({
        sorted: false,
        radiusSelector,
        getRadiusScale,
        sortedColour,
      });
      // FORCE.restartSimulation(nodes);
      this.setState({ sortedSize: false, radiusSelector, getRadiusScale });
    }
    setTimeout(this.handleResize, 1500);
  };
  sortColour = () => {
    const {
      nodes,
      uniqueClusterValues,
      clusterSelector,
      sortedSize,
    } = this.state;
    if (!this.state.sortedColour) {
      this.setState({ sortedColour: true });
      // split the view into sections for each cluster
      FORCE.sortColour({
        sorted: true,
        numClusters: uniqueClusterValues.length,
        sortedSize,
      });
      setTimeout(() => {
        FORCE.toggleClusterTags(
          true,
          nodes,
          uniqueClusterValues,
          clusterSelector,
        );
        this.handleResize();
      }, 500);
    } else {
      FORCE.toggleClusterTags(
        false,
        nodes,
        uniqueClusterValues,
        clusterSelector,
      );
      FORCE.sortColour({
        sorted: false,
        numClusters: uniqueClusterValues.length,
        sortedSize,
      });
      FORCE.restartSimulation(nodes);
      this.setState({ sortedColour: false });
      setTimeout(this.handleResize, 1500);
    }
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
          resetFilters: this.resetFilters,
          restartSimulation: this.restartSimulation,
          handleSliderMouseup: this.handleFilterMouseup,
          handleSnapshot: this.handleSnapshot,
          handleApplySnapshot: this.handleApplySnapshot,
          handleLoadFromSnapshot: this.handleLoadFromSnapshot,
          handleDeleteSnapshot: this.handleDeleteSnapshot,
          setNodes: nodes => this.setState({ nodes: nodes }),
          sortSize: this.sortSize,
          sortColour: this.sortColour,
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
