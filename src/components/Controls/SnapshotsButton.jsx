import Button from '@material-ui/core/Button';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import React from 'react';

const SnapshotsButton = props => (
  <Button
    style={{ maxWidth: 500, justifySelf: 'center', textTransform: 'none' }}
    variant="outlined"
    onClick={props.onSnapshot}
  >
    <span style={{ marginRight: 12 }}>Snapshot This State</span>
    {window.innerWidth < 500 ? <MobileScreenShareIcon /> : <ScreenShareIcon />}
  </Button>
);

export default SnapshotsButton;
