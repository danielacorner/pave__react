import React, { Component } from 'react';
import NOCData from '../../assets/NOC-data';
import FORCE from '../FORCE';
import html2canvas from 'html2canvas';
import debounce from 'lodash.debounce';
import * as d3 from 'd3';

const NOCDataProcessed = NOCData.map(d => {
  d.name = d.job;
  return d;
});

export const ControlsContext = React.createContext();
let nodesG;

const $ = element => document.querySelector(element); // jQuerify

class ContextProvider extends Component {
  constructor(props) {
    super(props);
    console.log('constructing context!');
    this.state = {
      originalData: NOCDataProcessed,
      nodes: NOCDataProcessed,
      filters: {
        skillsLang: 0,
        skillsLogi: 0,
        skillsMath: 0,
        skillsComp: 0,
      },
      radiusSelector: 'workers',
      clusterSelector: 'industry',
      radiusScale: () => {
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
      that: null,
    };
  }

  componentDidMount = () => {
    const {
      clusterCenters,
      radiusSelector,
      clusterSelector,
      uniqueClusterValues,
    } = this.state;

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

    window.addEventListener('resize', this.handleResize);
    setTimeout(this.handleResize, 1500);

    // tranlate nodes to center
    const [width, height] = [
      $('#svg').getBoundingClientRect().width,
      $('#graphContainer').getBoundingClientRect().height,
    ];

    nodesG = $('#nodesG');
    nodesG.style.transform = `translate(${width / 2}px,${height / 2}px)`;
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
    const [width, height] = [
      $('#svg').getBoundingClientRect().width,
      $('#graphContainer').getBoundingClientRect().height,
    ];
    // resize the graph container to fit the screen
    const constrainingLength = Math.min(width, height);
    const nodesWidth = nodesG.getBBox().width;

    // bugfix: zooming in because initial nodesWidth = 100, and doesn't resize correctly when browser focus isn't on this tab
    if (
      nodesWidth === 100 &&
      this.state.nodes.length === this.state.originalData.length
    ) {
      return 0.95;
    }

    return (constrainingLength * 0.95) / nodesWidth;
  };

  handleResize = debounce(() => {
    console.count('...resizing...');

    // translate the nodes group into the middle
    // nodesG.style.transform = `translate(${this.translate()})`;

    // setTimeout( () => (
    nodesG.style.transform = `translate(${this.translate()}) scale(${this.scale()})`;
    // ), 0, );
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
  // startSimulation = that => {
  //   const { nodes, radiusScale, clusterCenters, radiusSelector } = this.state;
  //   FORCE.startSimulation(
  //     { nodes, radiusScale, clusterCenters, radiusSelector },
  //     that,
  //   );
  // };
  restartSimulation = () => {
    // FORCE.restartSimulation();
    this.setState({
      nodes: this.filteredNodes(),
    });
    setTimeout(() => {
      FORCE.restartSimulation();
    }, 200);
    setTimeout(() => {
      this.handleResize();
    }, 1500);
  };

  handleSliderMouseup = () => {
    console.log('mouseup!');
    let newMinima = {};
    // set all filters to new minima on mouseup
    setTimeout(() => {
      Object.keys(this.state.filters).forEach(filter => {
        // console.log(Math.max(...this.state.nodes[filter]));
        newMinima[filter] = Math.min(...this.state.nodes.map(d => d[filter]));
      });
      // restart the simulation
      this.setState({ filters: newMinima }, this.restartSimulation);
    }, 0);
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
          nodesG.style.transform =
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
    this.handleSliderMouseup();
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
    console.log('sorting size!');
  };
  sortColour = () => {
    console.log('sorting colour!');
  };

  render() {
    return (
      <ControlsContext.Provider
        value={{
          state: this.state,

          setRadiusSelector: selector =>
            this.setState({ radiusSelector: selector }),

          setClusterSelector: selector =>
            this.setState({ clusterSelector: selector }),

          handleFilterChange: (filter, value) => {
            // !FORCE.paused && FORCE.stopSimulation();

            this.setState(
              {
                filters: { ...this.state.filters, [filter]: value },
              },
              this.filterNodes,
            );
          },
          resetFilters: () => {
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
          },

          // startSimulation: this.startSimulation,
          restartSimulation: this.restartSimulation,
          handleSliderMouseup: this.handleSliderMouseup,

          handleSnapshot: this.handleSnapshot,
          handleApplySnapshot: this.handleApplySnapshot,
          handleLoadFromSnapshot: this.handleLoadFromSnapshot,
          handleDeleteSnapshot: this.handleDeleteSnapshot,

          setNodes: nodes =>
            this.setState({
              nodes: nodes,
            }),

          // give the Viz context to the sliders
          setThis: that =>
            this.setState({
              that: that,
            }),

          sortSize: this.sortSize,
          sortColour: this.sortColour,
        }}
      >
        {this.props.children}
      </ControlsContext.Provider>
    );
  }
}

export default ContextProvider;
