import { createMuiTheme } from '@material-ui/core/styles';
// import Navbar from './components/Navbar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Router /* Link */ } from '@reach/router';
import React from 'react';
import './App.css';
import AppLayout from './components/AppLayout';
import ContextProvider from './components/Context/ContextProvider';
import Joyride from 'react-joyride';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { COLOUR_SALARY, COLOUR_STUDY, COLOUR_RISK } from './utils/constants';

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

const JoyrideTooltipStyles = styled.div`
  font-size: 18px;
  span {
    font-style: italic;
    &.salary {
      color: ${COLOUR_SALARY};
    }
    &.study {
      color: ${COLOUR_STUDY};
    }
    &.risk {
      color: ${COLOUR_RISK};
    }
  }
  svg {
    margin-bottom: -6px;
    transform: scale(1.2);
  }
`;

function App() {
  const steps = [
    {
      target: '.title',
      content: (
        <JoyrideTooltipStyles>
          <p>✨ Hey, welcome to Goodjob! 🚀</p>
          <p>
            This app can help you learn out about all kinds of jobs and careers
            in Canada.
          </p>
          <p>
            Click {`"`}Next{`"`} to continue....
          </p>
        </JoyrideTooltipStyles>
      ),
    },
    {
      target: '#svg',
      content: (
        <JoyrideTooltipStyles>
          <p>Woah, what{`'`}s all this junk?</p>
          <p>
            Thanks for asking! It{`'`}s called a data visualization, and it
            contains tonnes of handy-dandy information 🤓.
          </p>
          <p>
            You could probably spend a while here... but first, let me show you
            some of the tools we{`'`}ve included for you.
          </p>
        </JoyrideTooltipStyles>
      ),
    },
    {
      target: '.slidersDiv',
      content: (
        <JoyrideTooltipStyles>
          <p>
            These {`'`}filter sliders{`'`} will trim away jobs that don{`'`}t
            suit the skills you may want to learn, so you can make the
            visualization more relevant to you.
          </p>
        </JoyrideTooltipStyles>
      ),
    },
    {
      target: '.expandskillsLang',
      content: (
        <JoyrideTooltipStyles>
          <p>
            If you want to get <span>really</span> specific 🔬, click on the{' '}
            <ExpandMoreIcon /> button to see a total of fifteen sub-skills that
            make up each of the top-level skill categories.
          </p>
        </JoyrideTooltipStyles>
      ),
    },

    {
      target: '.btnLegendWrapper',
      content: (
        <JoyrideTooltipStyles>
          <p>
            Here{`'`}s where you{`'`}ll find out what exactly you{`'`}re looking
            at in the visualization above -- it also changes with the
            visualization.
          </p>
          <p>Legendary! 😎</p>
        </JoyrideTooltipStyles>
      ),
    },
    {
      target: '.sortBtnGroup',
      content: (
        <JoyrideTooltipStyles>
          <p>
            Just for fun, we{`'`}ve also hand-crafted these artisanal buttons.
          </p>
        </JoyrideTooltipStyles>
      ),
    },
    {
      target: '.labelAndSelect',
      content: (
        <JoyrideTooltipStyles>
          <p>We highly recommend 👆 this one here.</p>
          <p>
            You can use it to colour-code the jobs by{' '}
            <span className="salary">salary per year</span>,{' '}
            <span className="study">years of study</span>, or{' '}
            <span className="risk">
              risk of tasks being replaced by machines
            </span>
            .
          </p>
        </JoyrideTooltipStyles>
      ),
    },
    {
      target: '.btnFeedback',
      content: (
        <JoyrideTooltipStyles>
          <p>
            Goodjob is a work in progress, and we{`'`}d love to hear what you
            think. Click here to send us a message -- and check back often for
            updates.
          </p>
          <p>Thanks for visiting! 🎈</p>
        </JoyrideTooltipStyles>
      ),
    },
  ];
  return (
    <MuiThemeProvider theme={theme}>
      <ContextProvider>
        <Joyride steps={steps} continuous={true} />
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
