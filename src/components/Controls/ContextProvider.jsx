import React, { Component } from 'react';
import NOCData from '../../assets/NOC-data';
import FORCE from '../FORCE';

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
        skillsComp: 0
      },
      radiusSelector: 'workers',
      clusterSelector: 'industry',
      snapshots: []
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
    const nodesG = document.getElementById('nodesG');
    const vizHeight = document
      .getElementById('graphContainer')
      .getBoundingClientRect().height;
    nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight / 2}px)`;
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  componentDidUpdate(nextProps, nextState) {}

  handleResize = () => {
    console.log('...resizing...');

    const svgWidth = document.getElementById('svg').getBoundingClientRect()
      .width;
    const nodesG = document.getElementById('nodesG');
    const vizHeight = document
      .getElementById('graphContainer')
      .getBoundingClientRect().height;

    // translate the nodes group into the middle
    nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight / 2}px)`;

    // resize the graph container to fit the screen
    const scale = () => {
      const constrainingLength = Math.min(vizHeight, svgWidth);
      const nodesWidth = nodesG.getBBox().width;
      return (constrainingLength * 0.95) / nodesWidth;
    };
    setTimeout(
      () =>
        (nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight /
          2}px) scale(${scale()})`),
      0
    );
  };

  filteredNodes = () => {
    // filter the dataset according to the slider state
    return this.state.originalData.filter(node => {
      let keep = true;
      const { filters } = this.state;
      // for each filter variable ('skillsLang', 'skillsMath'...)
      Object.keys(filters).forEach(filterVar => {
        // filter out the node if less than the slider value
        if (node[filterVar] < filters[filterVar]) {
          keep = false;
        }
      });
      return keep;
    });
  };

  filterNodes = () => {
    // todo: why are circles sometimes visible entering at the center if paused before state change?
    // pause the simulation if running
    !FORCE.paused && FORCE.stopSimulation();

    this.setState({
      nodes: this.filteredNodes()
    });
  };

  restartSimulation = () => {
    FORCE.restartSimulation();
    this.setState({
      nodes: this.filteredNodes()
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
    const newSnapshot = {
      id:
        this.state.snapshots.length > 0
          ? Math.max(this.state.snapshots.map(d => d.id)) + 1
          : 0,
      filters: this.state.filters
    };
    this.setState({ snapshots: [...this.state.snapshots, newSnapshot] });

    console.log('snapped!', [...this.state.snapshots, newSnapshot]);

    localStorage.setItem(
      'snapshots',
      JSON.stringify([...this.state.snapshots, newSnapshot])
    );

    console.log('localstorage!', JSON.parse(localStorage.getItem('snapshots')));
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
              filters: { ...this.state.filters, [filter]: value }
            });
            setTimeout(this.filterNodes, 0);
          },

          restartSimulation: this.restartSimulation,

          handleSliderMouseup: this.handleSliderMouseup,

          handleSnapshot: this.handleSnapshot,

          setNodes: nodes =>
            this.setState({
              nodes: nodes
            })
        }}
      >
        {this.props.children}
      </ControlsContext.Provider>
    );
  }
}

export default ContextProvider;
