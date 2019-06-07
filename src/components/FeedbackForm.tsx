import React, { useEffect, useState, FormEvent } from 'react';
import styled from 'styled-components/macro';
import { TextField, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseRounded';
import SendIcon from '@material-ui/icons/SendRounded';
import * as emailjs from 'emailjs-com';

const FeedbackFormStyles = styled.div`
  border-radius: 4px;
  font-family: system-ui;
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center center;
  background: rgba(0, 0, 0, 0.4);
  h1 {
    margin: 0;
  }
  .formWrapper {
    border-radius: 4px;
    background: white;
    position: relative;
    padding: 20px;
    .feedbackForm {
      min-width: 270px;
      min-height: 350px;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      grid-gap: 10px;
      .btnGroup {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 10px;
        justify-content: end;
        button {
          text-transform: none;
          span {
            display: grid;
            grid-auto-flow: column;
            grid-gap: 10px;
          }
        }
      }
    }
    .btnClose {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
`;
interface FeedbackFormProps {
  setIsFeedbackOpen(bool: boolean): void;
}
interface SendFeedback {
  senderEmail: string;
  senderName: string;
  feedback: string;
  templateId: string | undefined;
  receiverEmail: string | undefined;
  userId: string | undefined;
}
export const FeedbackForm = ({ setIsFeedbackOpen }: FeedbackFormProps) => {
  const [sending, setSending] = useState(false as boolean | string);
  const [feedback, setFeedback] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      const ESC_KEY = 27;
      if (event.keyCode === ESC_KEY) {
        setIsFeedbackOpen(false);
      }
    };
    window.addEventListener('keydown', keydownListener);
    return () => {
      window.removeEventListener('keydown', keydownListener);
    };
  });

  const sendFeedback = ({
    senderEmail,
    senderName,
    feedback,
    templateId,
    receiverEmail,
    userId,
  }: SendFeedback) => {
    emailjs
      .send(
        'gmail_for_goodjob',
        templateId || '',
        {
          senderEmail,
          senderName,
          receiverEmail,
          feedback,
        },
        userId,
      )
      .then(() => {
        setSending('sent');
        setTimeout(() => {
          setIsFeedbackOpen(false);
        }, 2000);
      })
      // Handle errors here however you like, or use a React error boundary
      .catch((err: Error) =>
        console.error('Failed to send feedback. Error: ', err),
      );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const {
      REACT_APP_EMAILJS_RECEIVER: receiverEmail,
      REACT_APP_EMAILJS_TEMPLATEID: templateId,
      REACT_APP_EMAILJS_USERID: userId,
    } = process.env;
    setSending('sending');
    sendFeedback({
      senderName,
      senderEmail,
      feedback,
      templateId,
      receiverEmail,
      userId,
    });
  };

  return (
    <FeedbackFormStyles>
      <div className="formWrapper">
        <form className="feedbackForm" onSubmit={handleSubmit}>
          <h1>Your Feedback</h1>
          <TextField
            variant="outlined"
            className="textInput"
            id="nameEntry"
            name="nameEntry"
            onChange={event => {
              setSenderName(event.target.value);
            }}
            placeholder="Name (Optional)"
            value={senderName}
          />
          <TextField
            variant="outlined"
            className="textInput"
            id="emailEntry"
            name="emailEntry"
            onChange={event => {
              setSenderEmail(event.target.value);
            }}
            placeholder="Email (Optional)"
            value={senderEmail}
          />
          <TextField
            variant="outlined"
            rows={10}
            multiline={true}
            required={true}
            className="textInput"
            id="feedbackEntry"
            name="feedbackEntry"
            onChange={event => {
              setFeedback(event.target.value);
            }}
            placeholder="Enter your feedback here"
            value={feedback}
          />
          <div className="btnGroup">
            <Button
              variant="outlined"
              className="btn btnCancel"
              onClick={() => setIsFeedbackOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!!sending}
              variant="outlined"
              type="submit"
              className="btn btnSubmit"
            >
              {sending === 'sending'
                ? '...'
                : sending === 'sent'
                ? 'Thanks! 🎉'
                : 'Send '}
              {!sending && <SendIcon />}
            </Button>
          </div>
        </form>
        <IconButton
          className="btnClose"
          onClick={() => setIsFeedbackOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </FeedbackFormStyles>
  );
};
