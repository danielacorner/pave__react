import React, { Component } from 'react';
import './App.css';
import Viz from './components/Viz/Viz';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import ControlsTop from './components/Controls/ControlsTop';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import NOCData from './assets/NOC-data';
import * as d3 from 'd3';
import ContextProvider, {
  ControlsContext
} from './components/Controls/ContextProvider';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#49ac52',
      contrastText: '#fff'
    },
    secondary: { main: '#64b5f6' },
    contrastThreshold: 3
  }
});

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 64px auto 1fr;
`;

const filterVariables = [
  'skillsLang',
  'skillsLogi',
  'skillsMath',
  'skillsComp'
];

class App extends Component {
  state = {
    clusterSelector: 'industry',
    radiusSelector: 'workers',
    radiusScale: () => {
      const radii = NOCData.map(d => d[this.state.radiusSelector]);
      const radiusRange = [5, 50];
      return d3
        .scaleSqrt() // square root scale because radius of a circle
        .domain([d3.min(radii), d3.max(radii)])
        .range(radiusRange);
    },
    uniqueClusterValues: NOCData.map(d => d['industry']).filter(
      (value, index, self) => self.indexOf(value) === index
    ),
    clusterCenters: []
  };

  componentWillMount = () => {
    console.log('app mounting!');

    const {
      clusterCenters,
      radiusSelector,
      clusterSelector,
      uniqueClusterValues
    } = this.state;

    // initialize the clusters
    NOCData.forEach(d => {
      const cluster = uniqueClusterValues.indexOf(d[clusterSelector]) + 1;
      // add to clusters array if it doesn't exist or the radius is larger than any other radius in the cluster
      if (
        !clusterCenters[cluster] ||
        d[radiusSelector] > clusterCenters[cluster][radiusSelector]
      ) {
        clusterCenters[cluster] = d;
        // todo: emit new cluster centers
        this.setState({ clusterCenters: clusterCenters });
      }
      // if ([1, 100, 200, 300, 400].includes(d.id)) {
      // }
    });
  };

  render() {
    console.log('app rendering!');
    const {
      // forceCluster,
      clusterCenters,
      radiusSelector
      // clusterSelector
    } = this.state;
    return (
      <ContextProvider>
        <MuiThemeProvider theme={theme}>
          <ControlsContext.Consumer>
            {context => (
              <Container>
                <Navbar />
                <ControlsTop filterVariables={filterVariables} />
                <Viz
                  radiusScale={this.state.radiusScale()}
                  radiusSelector={radiusSelector}
                  clusterCenters={clusterCenters}
                  nodes={context.state.nodes}
                />
              </Container>
            )}
          </ControlsContext.Consumer>
        </MuiThemeProvider>
      </ContextProvider>
    );
  }
}

export default App;
