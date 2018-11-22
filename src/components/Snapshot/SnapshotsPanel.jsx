import React, { PureComponent } from 'react';
import { Typography, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
// import ShareIcon from '@material-ui/icons/Share';
// import { Link } from '@reach/router';
import CopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import SnapshotsButton from './SnapshotsButton';
import { ControlsContext } from '../Context/ContextProvider';
import SnapshotsWrapper from '../styles/SnapshotsWrapper';

export default class SnapshotsPanel extends PureComponent {
  state = {
    anchorEl: null,
    visibleDeleteButton: null,
    summaryBarsActive: true,
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
          <SnapshotsWrapper>
            <div className="controlsBottom">
              <SnapshotsButton onSnapshot={context.handleSnapshot} />
              <Button
                className="toggleSummaryBarsButton"
                variant="outlined"
                size="large"
                onClick={() => {
                  context.toggleSummaryBars();
                  this.setState({
                    summaryBarsActive: !this.state.summaryBarsActive,
                  });
                }}
              >
                {this.state.summaryBarsActive ? 'Hide' : 'Show'} Summary
                Statistics
              </Button>
            </div>

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
                      {/* View Snapshot */}
                      <MenuItem
                        onClick={() => {
                          context.handleApplySnapshot(ss.id);
                          this.handleClose();
                        }}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                        }}
                      >
                        <span>View Snapshot </span>
                        <PlayArrowIcon
                          style={{
                            marginLeft: 10,
                            justifySelf: 'right',
                            color: 'steelblue',
                          }}
                        />
                      </MenuItem>

                      {/* Copy Link to Snapshot */}
                      <MenuItem
                        style={{
                          height: 'auto',
                          cursor: 'default',
                          display: 'grid',
                          gridTemplateAreas: `
                          "title button"
                          "link button"`,
                        }}
                        disableRipple={true}
                      >
                        <span style={{ gridArea: 'title' }}>
                          Copy Link to Snapshot{' '}
                        </span>
                        <input
                          type="text"
                          name="snapshotLink"
                          readonly
                          style={{ gridArea: 'link' }}
                          value={`${window.location.origin}/${JSON.stringify(
                            ss.filters,
                          )
                            .replace('{', '%7B')
                            .replace('}', '%7D')}`}
                        />
                        <IconButton
                          style={{
                            gridArea: 'button',
                            marginLeft: 10,
                            marginRight: -12,
                            justifySelf: 'right',
                            color: '#4caf50',
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

                      {/* Delete Snapshot */}
                      <MenuItem
                        style={{
                          height: 'auto',
                          display: 'grid',
                          gridGap: 4,
                          gridTemplateColumns: '1fr auto',
                        }}
                        onClick={() => {
                          context.handleDeleteSnapshot(ss.id);
                          this.handleClose();
                        }}
                      >
                        <span>Delete Snapshot </span>
                        <DeleteIcon style={{ color: 'tomato' }} />
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                );
              })}
            </div>
          </SnapshotsWrapper>
        )}
      </ControlsContext.Consumer>
    );
  }
}
