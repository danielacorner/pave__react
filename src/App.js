import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Router /* Link */ } from '@reach/router';
import React from 'react';
import './App.css';
import AppLayout from './components/AppLayout';
import ContextProvider from './components/Context/ContextProvider';

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

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ContextProvider>
        {/* <Navbar /> */}
        <Router>
          <AppLayout path="/" />
          <AppLayout path="/:filtersQuery" />
        </Router>
      </ContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
