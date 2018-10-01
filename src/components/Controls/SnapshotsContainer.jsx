import React, { Component } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import ShareIcon from '@material-ui/icons/Share';

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
  state = {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <Container>
        {this.props.snapshots.map(ss => {
          return (
            <React.Fragment key={JSON.stringify(ss)}>
              <Button
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                className={`snapshotButton snapshotButton_${ss.id}`}
                onClick={this.handleClick}
              >
                <img src={ss.image} alt={`snapshot_${ss.id}`} />
                <Typography variant="caption">Snapshot #{ss.id + 1}</Typography>
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem
                  style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}
                  onClick={() => {
                    this.props.onShapshotClick(ss.id);
                    this.handleClose();
                  }}
                >
                  Apply Snapshot{' '}
                  <PlayArrowIcon
                    style={{
                      marginLeft: 10,
                      justifySelf: 'right',
                      color: 'steelblue'
                    }}
                  />
                </MenuItem>
                <MenuItem
                  style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}
                  onClick={this.handleClose}
                >
                  Copy Link to Snapshot{' '}
                  <ShareIcon
                    style={{
                      marginLeft: 10,
                      justifySelf: 'right',
                      color: 'steelblue'
                    }}
                  />
                </MenuItem>
              </Menu>
            </React.Fragment>
          );
        })}
      </Container>
    );
  }
}
