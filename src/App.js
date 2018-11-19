import React, { PureComponent } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
// import ContextProvider, {
//   ControlsContext
// } from './components/Controls/ContextProvider';
import { Router /* Link */ } from '@reach/router';
import Layout from './components/Layout';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#49ac52',
      contrastText: '#fff',
    },
    secondary: { main: '#64b5f6' },
    contrastThreshold: 3,
  },
});

class App extends PureComponent {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <Router>
          <Layout path="/" />
          <Layout path="/:filterState" />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
