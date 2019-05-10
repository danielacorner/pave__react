import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import styled from 'styled-components';
import { COLOUR_SALARY, COLOUR_STUDY, COLOUR_RISK } from '../utils/constants';

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
    target: '.title',
    content: (
      <JoyrideTooltipStyles>
        <p>✨ Hey, welcome to Goodjob! 🚀</p>
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
          tonnes of handy-dandy information 🤓.
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
          that don{`'`}t suit the skills you may want to learn, so you can make
          the visualization more relevant to you.
        </p>
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
    content: (
      <JoyrideTooltipStyles>
        <p>
          Click here to go <span className="italic">back 🕛 in 🕙 time 🕖</span>{' '}
          and reset all the filters to zero.
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
    target: '.colourByValue',
    content: (
      <JoyrideTooltipStyles>
        <p>We highly recommend 👆 this one here.</p>
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
    content: (
      <JoyrideTooltipStyles>
        <p>
          Goodjob is a work in progress, and we{`'`}d love to hear what you
          think -- click here to send us a message.
        </p>
        <p style={{ transform: 'scale(1.5)' }}>🛠</p>
        <p>Thanks for visiting, and check back often for updates! 🎈</p>
      </JoyrideTooltipStyles>
    ),
  },
];
