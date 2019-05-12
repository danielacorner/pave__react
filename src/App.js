import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Router } from '@reach/router';
import React, { useState } from 'react';
import './App.css';
import AppLayout from './components/AppLayout';
import ContextProvider from './components/Context/ContextProvider';
import Joyride from 'react-joyride';
import { joyrideSteps } from './components/JoyrideSteps';
import { NavBar } from './components/Nav/Navbar';
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
  const useForceUpdate = () => useState()[1];
  const forceUpdate = useForceUpdate();
  const [tourStarted, setTourStarted] = useState(false);
  console.log(tourStarted);
  //   const pulse = keyframes`
  //   0% {
  //     transform: scale(1);
  //   }

  //   55% {
  //     background-color: rgba(255, 100, 100, 0.9);
  //     transform: scale(1.6);
  //   }
  // `;
  //   const Beacon = styled.span`
  //     animation: ${pulse} 1s ease-in-out infinite;
  //     background-color: rgba(255, 27, 14, 0.6);
  //     border-radius: 50%;
  //     display: inline-block;
  //     height: 3rem;
  //     width: 3rem;
  //   `;

  // const BeaconComponent = props => <Beacon {...props} />;
  // const HideBeacon = () => null;

  const joyrideProps = {
    spotlightClicks: true,
    steps: joyrideSteps,
    continuous: true,
    getHelpers: helpers => {
      const leftRightListener = event => {
        const [LEFT_ARROW, RIGHT_ARROW] = [37, 39];
        if (event.keyCode === LEFT_ARROW) {
          helpers.prev();
        } else if (event.keyCode === RIGHT_ARROW) {
          helpers.next();
        }
      };
      window.addEventListener('keydown', leftRightListener);
    },
    // beaconComponent: tourStarted ? null : HideBeacon,
  };

  return (
    <MuiThemeProvider theme={theme}>
      <ContextProvider>
        <Joyride
          {...joyrideProps}
          // showSkipButton={true}
          // showProgress={true}
        />
        <NavBar setTourStarted={setTourStarted} forceUpdate={forceUpdate} />
        <Router>
          <AppLayout
            path="/"
            tourStarted={tourStarted}
            setTourStarted={setTourStarted}
            forceUpdate={forceUpdate}
          />
          <AppLayout path="/:filtersQuery" />
        </Router>
      </ContextProvider>
    </MuiThemeProvider>
  );
}

export default App;
