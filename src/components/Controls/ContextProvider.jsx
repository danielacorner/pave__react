import React, { Component } from 'react';

export const ControlsContext = React.createContext();

class ContextProvider extends Component {
  state = {
    filters: {
      skillsLang: 0,
      skillsLogi: 0,
      skillsMath: 0,
      skillsComp: 0
    },
    radiusSelector: 'workers',
    clusterSelector: 'industry'
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
          setFilter: (filter, value) =>
            this.setState({
              filters: { ...this.state.filters, [filter]: value }
            })
        }}
      >
        {this.props.children}
      </ControlsContext.Provider>
    );
  }
}

export default ContextProvider;
