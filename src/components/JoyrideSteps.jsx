import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import styled from 'styled-components';
import { COLOUR_SALARY, COLOUR_STUDY, COLOUR_RISK } from '../utils/constants';
import { EVENTS, ACTIONS, STATUS } from 'react-joyride';

export const handleJoyrideCallback = ({ data, setRun, setStepIndex }) => {
  const { action, index, type, status } = data;

  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    // Need to set our running state to false, so we can restart if we click start again.
    setRun(false);
    setStepIndex(0);
  } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

    if (index === 0) {
      setStepIndex(stepIndex);
      setTimeout(() => {
        setRun(true);
      }, 0);
    } else if (index === 1) {
      setRun(false);
      setStepIndex(stepIndex);
      setTimeout(() => {
        setRun(true);
      }, 0);
    } else if (index === 2 && action === ACTIONS.PREV) {
      setRun(false);
      setStepIndex(stepIndex);
      setTimeout(() => {
        setRun(true);
      }, 0);
    } else {
      // Update state to advance the tour
      setStepIndex(stepIndex);
      setTimeout(() => {
        setRun(true);
      }, 0);
    }
  }

  console.groupCollapsed(
    type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type,
  );
  console.log(data); //eslint-disable-line no-console
  console.groupEnd();
};

const JoyrideTooltipStyles = styled.div`
  margin-bottom: -20px;
  font-size: 18px;
  span {
    &.italic {
      font-style: italic;
    }
    &.bold {
      font-weight: bold;
    }
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

// TODO: add padding / white backgrounds to anything that will be spotlighted (each of these targets)
export const joyrideSteps = [
  {
    target: '.titleWrapper',
    content: (
      <JoyrideTooltipStyles>
        <p>
          <span role="img" aria-label="stars">
            ✨
          </span>{' '}
          Hey, welcome to Goodjob!{' '}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </p>
        <p>
          This app can help you learn about all kinds of jobs and careers in
          Canada.
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
          Thanks for asking! It{`'`}s called a{' '}
          <span className="bold">data visualization</span>, and it contains
          tonnes of handy-dandy information{' '}
          <span role="img" aria-label="nerd-smiley">
            🤓
          </span>
          .
        </p>
        <p>You could probably spend a while here...</p>
        <p>
          But first, let{`'`}s take a look at some of the tools we{`'`}ve
          included for you.
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.slidersDiv',
    content: (
      <JoyrideTooltipStyles>
        <p>
          These <span className="bold">filter sliders</span> will trim away jobs
          that don{`'`}t suit your skill preferences.
        </p>
        <p>Try filtering the dataset now.</p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.expandskillsLang',
    content: (
      <JoyrideTooltipStyles>
        <p>
          If you want to get <span className="italic">really</span> specific 🔬,
          click on the <ExpandMoreIcon /> button to see a total of fifteen
          sub-skills that make up each of the top-level skill categories.
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.btnReset',
    placement: 'bottom-end',
    content: (
      <JoyrideTooltipStyles>
        <p>
          Click here to go{' '}
          <span className="italic">
            back{' '}
            <span role="img" aria-label="clock-3">
              🕛
            </span>{' '}
            in{' '}
            <span role="img" aria-label="clock-2">
              🕙
            </span>{' '}
            time{' '}
            <span role="img" aria-label="clock-1">
              🕖
            </span>
          </span>{' '}
          and reset all the filters to zero.
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.btnLegendWrapper',
    placement: 'top-end',
    isFixed: true,
    content: (
      <JoyrideTooltipStyles>
        <p>
          Here{`'`}s where you{`'`}ll find out what exactly you{`'`}re looking
          at in the visualization above -- it also changes with the
          visualization.
        </p>
        <p>
          Legendary!{' '}
          <span role="img" aria-label="sunglasses-smiley">
            😎
          </span>
        </p>
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
    target: '.colourByValue',
    placement: 'bottom-start',
    content: (
      <JoyrideTooltipStyles>
        <p>
          We highly recommend{' '}
          <span role="img" aria-label="hand-point-up">
            👆
          </span>{' '}
          this one here.
        </p>
        <p>
          You can use it to colour-code the jobs by{' '}
          <span className="salary bold">salary per year</span>,{' '}
          <span className="study bold">years of study</span>, or{' '}
          <span className="risk bold">
            risk of tasks being replaced by machines
          </span>
          .
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.btnFeedback',
    placement: 'bottom-end',
    content: (
      <JoyrideTooltipStyles>
        <p style={{ transform: 'scale(1.5)' }}>
          <span role="img" aria-label="tools">
            🛠
          </span>
        </p>
        <p>
          Goodjob is a work in progress, and we{`'`}d love to hear what you
          think -- comments, suggestions, and feature requests are all welcome.
        </p>
        <p>
          Thanks for visiting, and check back often for updates!{' '}
          <span role="img" aria-label="balloon">
            🎈
          </span>
        </p>
      </JoyrideTooltipStyles>
    ),
  },
];
