import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import React, { useState } from 'react';
import './App.css';
import ContextProvider from './components/Context/ContextProvider';
import AppWithContext from './AppWithContext';
import { AddToHomeScreenBanner } from './components/AddToHomeScreenBanner';
import { PictogramClipPathsDefs } from './components/Viz/PictogramClipPathsDefs';
import { BeforeInstallPromptEvent } from './types';

export const brightGreen = '#49ac52';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: brightGreen,
      contrastText: '#fff',
    },
    secondary: { main: '#64b5f6' },
    contrastThreshold: 3,
  },
});

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(
    null as null | BeforeInstallPromptEvent,
  );

  window.addEventListener('beforeinstallprompt', (event: any) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();
    // Stash the event so it can be triggered later.
    setDeferredPrompt(event);
  });
  return (
    <MuiThemeProvider theme={theme}>
      <ContextProvider>
        <PictogramClipPathsDefs />
        <AppWithContext />
        <AddToHomeScreenBanner
          {...{
            deferredPrompt,
            setDeferredPrompt,
          }}
        />
      </ContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
