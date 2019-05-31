import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import BalloonIcon from '../assets/BalloonIcon';
import { brightGreen } from '../App';
import { Button } from '@material-ui/core';

const BannerStyles = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 300px;
  position: fixed;
  right: 8px;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  pointer-events: none;
  bottom: -64px;
  height: 40px;
  &.toastUp {
    pointer-events: auto;
    bottom: 10px;
  }
  button {
    text-transform: none;
  }
  .btnAddToHome {
    margin-right: 4px;
    padding: 0px 12px;
    svg {
      width: 20px;
      height: 20px;
      margin-right: 6px;
      margin-left: -4px;
    }
  }
  .btnClose {
    background: white;
    border: 2px solid ${brightGreen};
    color: ${brightGreen};
    width: 42px;
    min-width: 0px;
    padding: 0;
  }
`;
export const AddToHomeScreenBanner = ({
  deferredPrompt,
  setDeferredPrompt,
}) => (
  <BannerStyles className={deferredPrompt ? 'toastUp' : ''}>
    <Button
      className="btnAddToHome"
      color="primary"
      variant="contained"
      size="small"
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
      <BalloonIcon />
      <span>Add to Home Screen</span>
    </Button>
    <Button
      variant="contained"
      className="btnClose"
      onClick={() => {
        setDeferredPrompt(null);
      }}
    >
      <CloseIcon />
    </Button>
  </BannerStyles>
);
