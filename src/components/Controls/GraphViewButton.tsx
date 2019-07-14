import React from 'react';
import { Button, Switch } from '@material-ui/core';
import styled from 'styled-components';

const ButtonStyles = styled.div`
  position: fixed;
  bottom: 36px;
  right: 40px;
  button {
    padding: 8px 24px;
  }
`;
export default ({ isGraphView, setIsGraphView }) => (
  <ButtonStyles>
    <Button variant="contained" onClick={() => setIsGraphView(!isGraphView)}>
      Graph View <Switch checked={isGraphView} />
    </Button>
  </ButtonStyles>
);
