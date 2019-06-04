import React, { useState } from 'react';
import './App.css';
import AppLayout from './components/AppLayout';
import { NavBar } from './components/Nav/Navbar';
import { JoyrideWithSteps } from './components/Joyride';

function AppWithContext() {
  const [run, setRun] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [isJoyrideEnabled, setIsJoyrideEnabled] = useState(true);
  const joyRideProps = {
    run,
    setRun,
    stepIndex,
    setStepIndex,
    isJoyrideEnabled,
    setIsJoyrideEnabled,
  };
  return (
    <React.Fragment>
      {isJoyrideEnabled && <JoyrideWithSteps {...joyRideProps} />}
      <NavBar {...joyRideProps} />
      <AppLayout />
    </React.Fragment>
  );
}

export default AppWithContext;
