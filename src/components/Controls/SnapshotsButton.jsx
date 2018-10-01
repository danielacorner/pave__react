import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';

export default class SnapshotsButton extends Component {
  render() {
    return (
      <Button variant="outlined" onClick={this.props.onSnapshot}>
        <CameraIcon />
        <span style={{ marginLeft: 5 }}>Snapshot this state</span>
      </Button>
    );
  }
}
