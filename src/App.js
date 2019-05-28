import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import React, { useState } from 'react';
import './App.css';
import ContextProvider from './components/Context/ContextProvider';
import AppWithContext from './AppWithContext';
import { Button } from '@material-ui/core';
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

const AddToHomeScreenBanner = ({ deferredPrompt, setDeferredPrompt }) => (
  <Button
    onClick={() => {
      deferredPrompt.prompt();
      deferredPrompt.userChocie.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }}
  >
    Hello!
  </Button>
);

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  window.addEventListener('beforeinstallprompt', e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    setDeferredPrompt(e);
  });
  return (
    <MuiThemeProvider theme={theme}>
      <ContextProvider>
        <AppWithContext />
        {deferredPrompt && (
          <AddToHomeScreenBanner
            deferredPrompt={deferredPrompt}
            setDeferredPrompt={setDeferredPrompt}
          />
        )}
      </ContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
