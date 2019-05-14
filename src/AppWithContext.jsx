import { Router } from '@reach/router';
import React, { useContext } from 'react';
import './App.css';
import AppLayout from './components/AppLayout';
import Joyride from 'react-joyride';
import { joyrideSteps } from './components/JoyrideSteps';
import { NavBar } from './components/Nav/Navbar';
import * as d3 from 'd3';
import { ControlsContext } from './components/Context/ContextProvider';
// import styled, { keyframes } from 'styled-components';

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

function AppWithContext() {
  const { state } = useContext(ControlsContext);

  const joyrideProps = {
    spotlightClicks: true,
    steps: joyrideSteps,
    continuous: true,
    getHelpers: helpers => {
      const leftRightListener = event => {
        // use left and right arrows to navigate the tour
        const btnNext = document.querySelector(
          `[data-test-id="button-primary"][aria-label="Next"]`,
        );
        const [LEFT_ARROW, RIGHT_ARROW] = [37, 39];
        if (event.keyCode === LEFT_ARROW) {
          helpers.prev();
        } else if (event.keyCode === RIGHT_ARROW) {
          // disable right arrow if btnNext is disabled
          if (!Array.from(btnNext.classList).includes('btnNextDisabled')) {
            helpers.next();
          }
        }
      };
      window.addEventListener('keydown', leftRightListener);
    },
    callback: data => {
      const btnNext = document.querySelector(
        `[data-test-id="button-primary"][aria-label="Next"]`,
      );
      const disableNext = () => {
        btnNext &&
          btnNext.classList &&
          btnNext.classList.add('btnNextDisabled');
      };
      const enableNext = () => {
        btnNext &&
          btnNext.classList &&
          btnNext.classList.remove('btnNextDisabled');
      };

      // disable btnNext until user uses the filter sliders
      if (data.step.target === '.slidersDiv') {
        disableNext();

        const MIN_FILTER_BEFORE_NEXT = 20;
        d3.selectAll('[role="slider"]').on('mouseup', function() {
          if (this.getAttribute('aria-valuenow') > MIN_FILTER_BEFORE_NEXT) {
            enableNext();
          }
        });
      } else {
        enableNext();
      }
    },
    // beaconComponent: tourStarted ? null : HideBeacon,
  };

  return (
    <React.Fragment>
      <Joyride
        {...joyrideProps}
        // showSkipButton={true}
        // showProgress={true}
      />
      <NavBar />
      <Router>
        <AppLayout path="/" />
        <AppLayout path="/:filtersQuery" />
      </Router>
    </React.Fragment>
  );
}

export default AppWithContext;
