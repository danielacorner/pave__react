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
      hasResizedOnce: false
    };
  }
  componentWillMount = () => {
    this.setState({ nodes: this.state.originalData });
    console.log('mounting context!');
  };
  componentDidMount = () => {
    console.log('context mounted!');
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  };
  componentWillUnmount = () => {
    console.log('context unmounted!');
    window.removeEventListener('resize', this.handleResize);
  };

  handleResize = () => {
    console.log('resizing');

    const graphContainer = document.getElementById('graphContainer');
    const svg = document.getElementById('svg');
    const svgWidth = svg.getBoundingClientRect().width;
    const nodesG = document.getElementById('nodesG');
    const graphBB = graphContainer.getBoundingClientRect();
    const vizHeight = graphBB.height;

    // translate the nodes group into the middle
    nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight / 2}px)`;

    // resize the graph container to fit the screen
    const scale = () => {
      const constrainingLength = Math.min(vizHeight, svgWidth);
      const nodesWidth = nodesG.getBBox().width;
      return constrainingLength / nodesWidth;
    };

    // if it's the first resize, let the nodes stabilize first
    if (!this.state.hasResizedOnce) {
      setTimeout(() => {
        nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight /
          2}px) scale(${scale()})`;
      }, 2000);
      this.setState({ hasResizedOnce: true });
    } else {
      nodesG.style.transform = `translate(${svgWidth / 2}px,${vizHeight /
        2}px) scale(${scale()})`;
    }
  };

  filterNodes = () => {
    // filter the dataset according to the slider state
    const filteredNodes = this.state.originalData.filter(node => {
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

    // todo: why are the circles visible entering at the center if paused before state change...
    // // pause the simulation if running
    // !FORCE.paused && FORCE.stopSimulation();

    this.setState({
      nodes: filteredNodes
    });

    // todo: but the simulation keep running if paused after state change?
    // pause the simulation if running
    !FORCE.paused && FORCE.stopSimulation();
  };
  restartSimulation = () => {
    FORCE.restartSimulation();

    const filteredNodes = this.state.originalData.filter(node => {
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

    this.setState({
      nodes: filteredNodes
    });

    // zoom in / out after mouseup
    setTimeout(this.handleResize, 2000);
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
            this.filterNodes();
          },

          restartSimulation: this.restartSimulation,

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
