import Drawer from '@material-ui/core/Drawer';
import React from 'react';

const MobileTooltip = ({ data, setMobileTooltipProps }) => {
  const fullList = (
    <div className={'drawer'}>{`Hey I'm a drawer over here!`}</div>
  );

  return (
    <div onClick={() => setMobileTooltipProps(null)}>
      <Drawer
        anchor="bottom"
        open={!!data}
        // onClose={setMobileTooltipProps(null)}
      >
        <div
          tabIndex={0}
          role="button"
          // onClick={setMobileTooltipProps(null)}
          // onKeyDown={setMobileTooltipProps(null)}
        >
          {fullList}
        </div>
      </Drawer>
    </div>
  );
};

export default MobileTooltip;
