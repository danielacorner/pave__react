import { IconButton, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/DeleteForever';
// import ShareIcon from '@material-ui/icons/Share';
// import { Link } from '@reach/router';
import CopyIcon from '@material-ui/icons/FileCopy';
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded';
import React, { useContext, useState } from 'react';
import { ControlsContext } from '../Context/ContextProvider';
import SnapshotsWrapper from '../styles/SnapshotsWrapper';
import SnapshotsButton from './SnapshotsButton';

const SnapshotsPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryBarsActive, setSummaryBarsActive] = useState(true);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    this.setState({ anchorEl: null });
  };
  const context = useContext(ControlsContext);

  return (
    <SnapshotsWrapper>
      <div className="controlsBottom">
        <SnapshotsButton onSnapshot={context.handleSnapshot} />
        <Button
          style={{ textTransform: 'none' }}
          className="toggleSummaryBarsButton"
          variant="outlined"
          size="large"
          onClick={() => {
            context.toggleSummaryBars();
            setSummaryBarsActive(!summaryBarsActive);
          }}
        >
          {summaryBarsActive ? 'Hide' : 'Show'} Summary Statistics
        </Button>
      </div>

      <div
        className={`snapshotsScrollContainer ${context.state.snapshots.length >
          0 && `open`}`}
      >
        {context.state.snapshots.map(ss => {
          return (
            // TODO: extract component here
            <React.Fragment key={JSON.stringify(ss)}>
              <Button
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                className={`snapshotButton snapshotButton_${ss.id}`}
                onClick={handleClick}
              >
                <img src={ss.image} alt={`snapshot_${ss.id}`} />
                <Typography variant="caption">Snapshot #{ss.id + 1}</Typography>
              </Button>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* View Snapshot */}
                <MenuItem
                  onClick={() => {
                    context.handleApplySnapshot(ss.id);
                    handleClose();
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
                    readOnly
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
                      document.querySelector('[name="snapshotLink"]').select();
                      document.execCommand('copy');
                      handleClose();
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
                    handleClose();
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
  );
};
export default SnapshotsPanel;
