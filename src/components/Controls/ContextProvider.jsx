import React, { Component } from 'react';
import NOCData from '../../assets/NOC-data';
import FORCE from '../FORCE';
import html2canvas from 'html2canvas';
import debounce from 'lodash.debounce';

export const ControlsContext = React.createContext();

class ContextProvider extends Component {
  constructor(props) {
    super(props);
    console.log('constructing context!');
    this.state = {
      originalData: NOCData.map(d => {
        d.name = d.job;
        return d;
      }),
      nodes: [],
      filters: {
        skillsLang: 0,
        skillsLogi: 0,
        skillsMath: 0,
        skillsComp: 0,
      },
      radiusSelector: 'workers',
      clusterSelector: 'industry',
      snapshots: [],
    };
  }

  componentWillMount = () => {
    this.setState({ nodes: this.state.originalData });
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
    setTimeout(this.handleResize, 1500);

    // tranlate nodes to center
    const svgWidth = document.getElementById('svg').getBoundingClientRect()
      .width;

    const vizHeight = document
      .getElementById('graphContainer')
      .getBoundingClientRect().height;

    document.getElementById('nodesG').style.transform = `translate(${svgWidth /
      2}px,${vizHeight / 2}px)`;
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  componentDidUpdate(nextProps, nextState) {}

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.nodes !== nextState.nodes;
  }

  translate = () => {
    const svgWidth = document.getElementById('svg').getBoundingClientRect()
      .width;
    const vizHeight = document
      .getElementById('graphContainer')
      .getBoundingClientRect().height;
    return `${svgWidth / 2}px,${vizHeight / 2}px`;
  };
  scale = () => {
    const svgWidth = document.getElementById('svg').getBoundingClientRect()
      .width;
    const nodesG = document.getElementById('nodesG');
    const vizHeight = document
      .getElementById('graphContainer')
      .getBoundingClientRect().height;
    // resize the graph container to fit the screen
    const constrainingLength = Math.min(vizHeight, svgWidth);
    const nodesWidth = nodesG.getBBox().width;

    // bugfix: zooming in because initial nodesWidth = 100, and doesn't fill resize when loading from another tab
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
    const nodesG = document.getElementById('nodesG');

    // translate the nodes group into the middle
    nodesG.style.transform = `translate(${this.translate()})`;

    setTimeout(
      () =>
        (nodesG.style.transform = `translate(${this.translate()}) scale(${this.scale()})`),
      0,
    );
  }, 150);

  filteredNodes = () => {
    // filter the dataset according to the slider state
    const { filters, originalData } = this.state;
    const filterKeys = Object.keys(filters);
    const numFilters = filterKeys.length;
    const numNodes = originalData.length;
    const filteredData = [];
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
      keep && filteredData.push(node);
    }
    return filteredData;
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
    FORCE.restartSimulation();
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
    setTimeout(this.restartSimulation, 0);
    let newMinima = {};
    setTimeout(() => {
      Object.keys(this.state.filters).forEach(filter => {
        // console.log(Math.max(...this.state.nodes[filter]));
        newMinima[filter] = Math.min(...this.state.nodes.map(d => d[filter]));
      });
      this.setState({ filters: newMinima });
    }, 0);
  };

  handleSnapshot = () => {
    const gc = document.querySelector('#graphContainer');
    html2canvas(
      gc,
      // options
      {
        // x: document.querySelector('#nodesG').getBoundingClientRect().x,
        // y: document.querySelector('#nodesG').getBoundingClientRect().y,
        // width: document.querySelector('#nodesG').getBoundingClientRect().width,
        // height: document.querySelector('#nodesG').getBoundingClientRect()
        //   .height,
        // scrollX: document.querySelector('#nodesG').getBoundingClientRect().left,
        // scrollY: document.querySelector('#nodesG').getBoundingClientRect().top,
        onclone: document => {
          document.querySelector('#nodesG').style.transform =
            // todo: calculate this
            `translate(150px,100px) scale(${this.scale() * 0.5})`;
        },
      },
    ).then(canvas => {
      // document.querySelector(
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

          setFilter: (filter, value) => {
            this.setState({
              filters: { ...this.state.filters, [filter]: value },
            });
            setTimeout(this.filterNodes, 0);
          },
          resetFilters: () => {
            const filtersReset = this.state.filters;
            Object.keys(this.state.filters).map(key => (filtersReset[key] = 0));
            this.setState({
              filters: filtersReset,
            });
            setTimeout(this.filterNodes, 0);
            setTimeout(this.restartSimulation, 0);
          },

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
