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
  grid-template-rows: 64px 150px auto;
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
      const radiusRange = [2, 25];
      return d3
        .scaleSqrt() // square root scale because radius of a circle
        .domain([d3.min(radii), d3.max(radii)])
        .range(radiusRange);
    }
  };
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Container>
          <Navbar />
          <ControlsTop data={NOCData} filterVariables={filterVariables} />
          <Viz radiusScale={this.state.radiusScale()} data={NOCData} />
        </Container>
      </MuiThemeProvider>
    );
  }
}

export default App;
