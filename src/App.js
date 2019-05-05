import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Router /* Link */ } from '@reach/router';
import React, { Component } from 'react';
import './App.css';
import AppLayout from './components/AppLayout';
import ContextProvider from './components/Context/ContextProvider';
import styled from 'styled-components';

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

const AppTitleStyles = styled.div`
font-family: system-ui;
  h1{
  font-size: 24px;
  margin: 0 12px;
  }
span{
  font-size: 18px;
  text-shadow: none;
}
`

const AppTitle = () => <AppTitleStyles>
  <h1>Goodjob 🎈 <span>Explore Canadian Careers</span></h1>
</AppTitleStyles>
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <ContextProvider>
          {/* <Navbar /> */}
          <AppTitle />
          <Router>
            <AppLayout path="/" />
            <AppLayout path="/:filtersQuery" />
          </Router>
        </ContextProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
