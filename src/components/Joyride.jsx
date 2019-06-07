import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import styled from 'styled-components/macro';
import { COLOUR_SALARY, COLOUR_STUDY, COLOUR_RISK } from '../utils/constants';
import Joyride, { EVENTS, ACTIONS, STATUS } from 'react-joyride';
import * as d3 from 'd3';

// import styled, { keyframes } from 'styled-components/macro';

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

function disableNext() {
  const btnNext = document.querySelector(
    `[data-test-id="button-primary"][aria-label="Next"]`,
  );
  btnNext && btnNext.classList && btnNext.classList.add('btnNextDisabled');
}
function enableNext() {
  const btnNext = document.querySelector(
    `[data-test-id="button-primary"][aria-label="Next"]`,
  );
  btnNext && btnNext.classList && btnNext.classList.remove('btnNextDisabled');
}

const handleJoyrideCallback = ({
  data,
  setRun,
  setStepIndex,
  setIsJoyrideEnabled,
}) => {
  const { action, index, type, status, step } = data;

  if (step.target === '.btnHelp' && type === 'tooltip') {
    // skip from tour button to title
    setStepIndex(1);
  }

  // TODO: only disable if moving forward not backward

  if (step.target === '#node_292') {
    window.scroll(0, 100);
  } else if (step.target === '.sortByType') {
    window.scroll(0, 600);
  } else if (step.target === '.slidersDiv') {
    // Disable btnNext until user uses the filter sliders
    disableNext();

    const MIN_FILTER_BEFORE_NEXT = 20;

    d3.selectAll('[role="slider"]')
      .on('mouseup', function() {
        if (this.getAttribute('aria-valuenow') > MIN_FILTER_BEFORE_NEXT) {
          enableNext();
        }
      })
      .on('touchend', function() {
        if (this.getAttribute('aria-valuenow') > MIN_FILTER_BEFORE_NEXT) {
          enableNext();
        }
      });
    window.scroll(0, 70);
  } else if (step.target === '.btnReset') {
    window.scroll(0, 100);
    // Disable btnNext until user clicks reset
    disableNext();
    d3.select('.btnReset').on('mouseup', function() {
      enableNext();
    });
  } else if (step.target === '.colourByValue') {
    window.scroll(0, 200);
    // Disable btnNext until user clicks reset
    disableNext();
    d3.select('.colourByValue').on('mouseup', function() {
      d3.select('.react-joyride__tooltip').style('opacity', '0.1');
      setTimeout(() => {
        d3.select('.react-joyride__tooltip').style('opacity', '1');
        enableNext();
      }, 1750);
    });
  } else if (step.target === '.btnLegendWrapper button') {
    window.scroll(0, document.body.scrollHeight);
  } else if (step.target === '.btnFeedback') {
    window.scroll(0, 0);
  }

  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    // Need to set our running state to false, so we can restart if we click start again.
    setRun(false);
    setStepIndex(0);
  } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

    if (index === 1) {
      // skip from the first to the second step
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

  if (data.type === 'tour:end') {
    setIsJoyrideEnabled(false);
    // TODO: clean up all listeners created above
  }

  // console.log(data);
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
    transform: scale(1.6);
  }
`;

// TODO: add padding / white backgrounds to anything that will be spotlighted (each of these targets)
const joyrideSteps = [
  {
    target: '.btnHelp',
    content: <div />,
  },
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
          Thanks for asking! It{`'`}s a representation of{' '}
          <span className="bold">all the jobs in Canada</span>, based on a
          government dataset called the National Occupation Codes.
        </p>
        <p>Each circle is a "job group". Let's take a closer look...</p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '#node_292',
    styles: { spotlight: { borderRadius: '100%' } },
    content: (
      <JoyrideTooltipStyles>
        <p>This is the job "Retail salespersons".</p>
        <p>
          The <span className="bold">size</span> of the circle reflects{' '}
          <span className="bold">how many workers</span> are doing this job.
          Since people come and go, you may have an easier time finding work in
          a bigger job like this.
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.btnLegendWrapper button',
    placement: 'top-end',
    isFixed: true,
    content: (
      <JoyrideTooltipStyles>
        <p>Here's where you'll find what the current sizes and colours mean.</p>
        <p>
          Legendary!{' '}
          <span role="img" aria-label="sunglasses-smiley">
            😎
          </span>
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  // TODO: add step for tooltip
  {
    target: '.slidersDiv',
    content: (
      <JoyrideTooltipStyles>
        <p>Each job uses different skills in different amounts.</p>
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
          If you want to get <span className="italic">really</span> specific,
          click on the <ExpandMoreIcon /> button to see a total of
          <span className="bold"> fifteen sub-skills </span>
          that make up each of the skill categories.
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
          and reset all the filters and toggles.
        </p>
      </JoyrideTooltipStyles>
    ),
  },
  // TODO: change this tooltip based on current state? or simply reset state when tour starts
  {
    target: '.colourByValue',
    content: (
      <JoyrideTooltipStyles>
        <p>
          Jobs are grouped into 10 "industries" — it's easier to change jobs
          within one.
        </p>
        <p>Switch this toggle now to see the industries.</p>
      </JoyrideTooltipStyles>
    ),
  },
  {
    target: '.select',
    // placement: 'bottom-start',
    content: (
      <JoyrideTooltipStyles>
        <p>
          You can colour-code the jobs by <span className="bold">industry</span>
          , <span className="salary bold">salary</span>,{' '}
          <span className="study bold">years of study</span>, or{' '}
          <span className="risk bold">risk of being replaced by machines</span>,
          whatever interests you most.
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
          think — comments, suggestions, and feature requests are all welcome.
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

export const JoyrideWithSteps = ({
  run,
  setRun,
  stepIndex,
  setStepIndex,
  setIsJoyrideEnabled,
}) => {
  const joyrideProps = {
    disableScrolling: true,
    spotlightClicks: true,
    showSkipButton: true,
    showProgress: true,
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
          if (
            btnNext &&
            btnNext.classList &&
            !Array.from(btnNext.classList).includes('btnNextDisabled')
          ) {
            helpers.next();
          }
        }
      };
      window.addEventListener('keydown', leftRightListener);
    },
    callback: data =>
      handleJoyrideCallback({
        data,
        setRun,
        setStepIndex,
        setIsJoyrideEnabled,
      }),
    run,
    stepIndex,
    // callback: data => {
    //   const btnNext = document.querySelector(
    //     `[data-test-id="button-primary"][aria-label="Next"]`,
    //   );
    //   const disableNext = () => {
    //     btnNext &&
    //       btnNext.classList &&
    //       btnNext.classList.add('btnNextDisabled');
    //   };
    //   const enableNext = () => {
    //     btnNext &&
    //       btnNext.classList &&
    //       btnNext.classList.remove('btnNextDisabled');
    //   };

    //   // disable btnNext until user uses the filter sliders
    //   if (data.step.target === '.slidersDiv') {
    //     disableNext();

    //     const MIN_FILTER_BEFORE_NEXT = 20;
    //     d3.selectAll('[role="slider"]')
    //       .on('mouseup', function() {
    //         if (this.getAttribute('aria-valuenow') > MIN_FILTER_BEFORE_NEXT) {
    //           enableNext();
    //         }
    //       })
    //       .on('touchend', function() {
    //         if (this.getAttribute('aria-valuenow') > MIN_FILTER_BEFORE_NEXT) {
    //           enableNext();
    //         }
    //       });
    //   } else {
    //     enableNext();
    //   }
    // },

    // beaconComponent: tourStarted ? null : HideBeacon,
  };
  if (stepIndex !== null) {
    return <Joyride {...joyrideProps} />;
  } else {
    return null;
  }
};
