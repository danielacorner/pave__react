import React, { Component } from 'react';
import NOCData from '../../assets/NOC-data';
import _ from 'lodash';

export const ControlsContext = React.createContext();

class ContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: NOCData.map(d => {
        d.name = d.job;
        return d;
      }),
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

  filterNodes = () => {
    const filteredNodes = NOCData.map(d => {
      d.name = d.job;
      return d;
    }).filter(node => {
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
