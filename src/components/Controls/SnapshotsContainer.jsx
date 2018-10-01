import React, { Component } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
  .snapshotButton {
    display: grid;
    grid-auto-flow: row;
    text-transform: none;
    img {
      width: 100%;
      margin-bottom: 4px;
      object-fit: contain;
    }
  }
`;

export default class SnapshotsContainer extends Component {
  render() {
    return (
      <Container>
        {this.props.snapshots.map(ss => {
          return (
            <Button
              className={`snapshotButton snapshotButton_${ss.id}`}
              key={JSON.stringify(ss)}
              onClick={() => this.props.onShapshotClick(ss.id)}
            >
              <img src={ss.image} alt={`snapshot_${ss.id}`} />
              <Typography variant="caption">Snapshot #{ss.id + 1}</Typography>
            </Button>
          );
        })}
      </Container>
    );
  }
}
