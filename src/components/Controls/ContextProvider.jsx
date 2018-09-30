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
      clusterSelector: 'industry'
    };
  }
  componentWillMount = () => {
    this.setState({ nodes: this.state.originalData });
    console.log('mounting context!');
  };
  componentDidMount = () => {
    console.log('context mounted!');
  };
  componentWillUnmount = () => {
    console.log('context unmounted!');
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
