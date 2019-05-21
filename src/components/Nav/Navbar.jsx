import { Button } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/MessageRounded';
import InfoIcon from '@material-ui/icons/InfoRounded';
import styled from 'styled-components';
import React, { useState } from 'react';
import MediaQuery from 'react-responsive';
import { MOBILE_MIN_WIDTH, TABLET_MIN_WIDTH } from '../../utils/constants';
import { FeedbackForm } from '../FeedbackForm';
export const NAV_HEIGHT = 64;
const NAV_PADDING_TOP = 12;
const NavBarStyles = styled.div`
  height: ${NAV_HEIGHT - NAV_PADDING_TOP}px;
  background: white;
  display: grid;
  grid-template-columns: auto 1fr;
  font-family: system-ui;
  padding: 12px 10px 0 10px;
  @media (min-width: ${MOBILE_MIN_WIDTH}px) {
    padding: ${NAV_PADDING_TOP}px 12px 0 20px;
  }

  h1.title {
    max-width: 500px;
    font-size: 24px;
    margin: 0;
  }
  h2.subtitle {
    font-size: 16px;
    margin: 6px 0 0 0;
    @media (min-width: ${MOBILE_MIN_WIDTH}px) {
      margin: 0;
    }
  }
  h5 {
    margin: 8px 0 0 0;
  }
  .navButtons {
    display: grid;
    grid-auto-flow: row;
    place-items: start end;
    justify-content: end;
    grid-gap: 5px;
    button {
      display: grid;
      place-items: center center;
      background: white;
      text-transform: none;
      height: 34px;
      & > span {
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 4px;
      }
    }

    .small {
      span {
        grid-gap: 4px;
      }
      svg {
        max-width: 20px;
      }
    }
  }
  @media (min-width: ${MOBILE_MIN_WIDTH + 15}px) {
    .navButtons {
      grid-auto-flow: column;
    }
    button {
      height: 40px;
      padding: 5px 12px;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
`;

export const NavBar = ({
  isJoyrideEnabled,
  setIsJoyrideEnabled,
  setRun,
  setStepIndex,
}) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <MediaQuery query={`(min-width: ${TABLET_MIN_WIDTH}px)`}>
      {isTabletOrLarger => (
        <NavBarStyles>
          <div className="titleColumn">
            <div className="titleWrapper">
              <h1 className="title">
                Goodjob{' '}
                <span role="img" aria-label="balloon">
                  🎈
                </span>
              </h1>
              <h2 className="subtitle">Explore Canadian Careers</h2>
            </div>
          </div>
          <div className="navButtons">
            <Button
              size={isTabletOrLarger ? 'medium' : 'small'}
              variant="outlined"
              onClick={() => setIsFeedbackOpen(true)}
              className={`btnFeedback ${isTabletOrLarger ? 'large' : 'small'}`}
            >
              Feedback <MessageIcon />
            </Button>
            <Button
              disabled={isJoyrideEnabled}
              size={isTabletOrLarger ? 'medium' : 'small'}
              variant="outlined"
              onClick={() => {
                setIsJoyrideEnabled(true);
                setStepIndex(0);
                setRun(true);
              }}
              className={`btnHelp ${isTabletOrLarger ? 'large' : 'small'}`}
            >
              Tour <InfoIcon />
            </Button>
          </div>
          {isFeedbackOpen && (
            <FeedbackForm setIsFeedbackOpen={setIsFeedbackOpen} />
          )}
        </NavBarStyles>
      )}
    </MediaQuery>
  );
};
