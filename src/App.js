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
import { Router, Link } from '@reach/router';
import Pave from './components/Pave';

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

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <Router>
          <Pave path="/" />
          <Pave path="/:filterState" />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
