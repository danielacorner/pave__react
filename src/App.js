import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import React from 'react';
import './App.css';
import ContextProvider from './components/Context/ContextProvider';
import AppWithContext from './AppWithContext';
// import styled, { keyframes } from 'styled-components';

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
        <AppWithContext />
      </ContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
