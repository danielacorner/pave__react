import React, { Component } from 'react';
import styled from 'styled-components';
import { Typography, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import ShareIcon from '@material-ui/icons/Share';
import { Link } from '@reach/router';
import CopyIcon from '@material-ui/icons/FileCopy';
import SnapshotsButton from './SnapshotsButton';
import { ControlsContext } from '../ContextProvider';

const Container = styled.div`
  padding: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 95px, 1fr;
  .snapshotsScrollContainer {
    overflow-y: scroll;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    height: 0px;
    transition: height 0.5s ease-in-out;
    &.open {
      height: 85px;
    }
  }
  .snapshotButton {
    display: grid;
    grid-auto-flow: row;
    text-transform: none;
    height: 75px;
    img {
      width: 85px;
      height: 50px;
      margin-bottom: 4px;
      object-fit: fill;
    }
  }
`;
// <div className="snapshotsDiv">
//   <SnapshotsPanel
//     snapshots={context.state.snapshots}
//     onShapshotClick={id => context.handleApplySnapshot(id)}
//   />
// </div>

export default class SnapshotsPanel extends Component {
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
      <ControlsContext.Consumer>
        {context => (
          <Container>
            <SnapshotsButton onSnapshot={context.handleSnapshot} />
            <div
              className={`snapshotsScrollContainer ${context.state.snapshots
                .length > 0 && `open`}`}
            >
              {context.state.snapshots.map(ss => {
                return (
                  <React.Fragment key={JSON.stringify(ss)}>
                    <Button
                      aria-owns={anchorEl ? 'simple-menu' : null}
                      aria-haspopup="true"
                      className={`snapshotButton snapshotButton_${ss.id}`}
                      onClick={this.handleClick}
                    >
                      <img src={ss.image} alt={`snapshot_${ss.id}`} />
                      <Typography variant="caption">
                        Snapshot #{ss.id + 1}
                      </Typography>
                    </Button>

                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          this.props.onShapshotClick(ss.id);
                          this.handleClose();
                        }}
                      >
                        <Link
                          style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto'
                          }}
                          // to={`/`}
                          to={`/${JSON.stringify(
                            ss.filters
                            // Object.keys(ss.filters).map(
                            // filter => `${filter}=${ss.filters[filter]}`
                            // )}`}
                          )}`}
                        >
                          View Snapshot{' '}
                          <PlayArrowIcon
                            style={{
                              marginLeft: 10,
                              justifySelf: 'right',
                              color: 'steelblue'
                            }}
                          />
                        </Link>{' '}
                      </MenuItem>
                      <MenuItem
                        style={{
                          height: 'auto',
                          display: 'grid',
                          gridGap: 4,
                          gridTemplateColumns: '1fr auto'
                        }}
                        disableRipple={true}
                      >
                        Copy Link to Snapshot <span />
                        <input
                          type="text"
                          name="snapshotLink"
                          readonly
                          value={`${window.location.origin}/${JSON.stringify(
                            ss.filters
                          )
                            .replace('{', '%7B')
                            .replace('}', '%7D')}`}
                        />
                        <IconButton
                          style={{
                            marginLeft: 10,
                            justifySelf: 'right',
                            color: 'steelblue'
                          }}
                          onClick={() => {
                            document
                              .querySelector('[name="snapshotLink"]')
                              .select();
                            document.execCommand('copy');
                            this.handleClose();
                          }}
                        >
                          <CopyIcon />
                        </IconButton>
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                );
              })}
            </div>
          </Container>
        )}
      </ControlsContext.Consumer>
    );
  }
}
