import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';

export default class SnapshotsButton extends Component {
  render() {
    return (
      <Button variant="outlined" onClick={this.props.onSnapshot}>
        {window.innerWidth < 500 ? (
          <MobileScreenShareIcon />
        ) : (
          <ScreenShareIcon />
        )}
        <span style={{ marginLeft: 5 }}>Snapshot this state</span>
      </Button>
    );
  }
}
