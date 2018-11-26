import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';

export default class SnapshotsButton extends Component {
  render() {
    return (
      <Button
        style={{ maxWidth: 500, justifySelf: 'center', textTransform: 'none' }}
        variant="outlined"
        onClick={this.props.onSnapshot}
      >
        <span style={{ marginRight: 12 }}>Snapshot This State</span>
        {window.innerWidth < 500 ? (
          <MobileScreenShareIcon />
        ) : (
          <ScreenShareIcon />
        )}
      </Button>
    );
  }
}
