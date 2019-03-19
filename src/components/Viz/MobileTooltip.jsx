import Drawer from '@material-ui/core/Drawer';
import MoneyIcon from '@material-ui/icons/MonetizationOnOutlined';
import SchoolIcon from '@material-ui/icons/SchoolRounded';
import WarningIcon from '@material-ui/icons/WarningRounded';
import React from 'react';
import styled from 'styled-components';

const getMobileTooltipStyles = ({
  color,
  salaryMedPercent,
  automationRisk,
  educationPercent,
}) => styled.div`
  font-family: 'Roboto light';
  margin: 0;
  padding: 6pt 12pt;
  font-size: 12pt;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  line-height: 14pt;
  .title {
    margin: 0 0 8pt 0;
    line-height: 16pt;
  }
  .heading {
    font-weight: bold;
    display: grid;
    grid-gap: 2px;
    place-items: center start;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 2.7fr;
    grid-gap: 15px;
  }
  .center {
    text-align: center;
  }
  .textAlignRight {
    text-align: right;
  }
  .textAlignLeft {
    text-align: left;
  }
  .iconTitle {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 4px;
    place-items: center start;
  }
  .bar {
    align-self: center;
    height: 10px;
    &.salaryBar {
      background: lime;
      width: ${salaryMedPercent * 100}%;
    }
    &.riskBar {
      background: tomato;
      width: ${automationRisk * 100}%;
    }
    &.educationBar {
      background: cornflowerblue;
      width: ${educationPercent * 100}%;
    }
  }
`;
const MobileTooltipContents = ({ data }) => {
  const {
    job,
    industry,
    salaryMed,
    color,
    salaryMedPercent,
    automationRisk,
    educationPercent,
    yearsStudy,
  } = data;
  const MobileTooltipStyles = getMobileTooltipStyles({
    color,
    salaryMedPercent,
    automationRisk,
    educationPercent,
  });
  return (
    <MobileTooltipStyles>
      <h3 className="title center">{job}</h3>
      <div className="grid">
        <div className="heading">Industry:</div>
        <div className="data textAlignLeft">{industry}</div>

        <div className="heading">
          <div className="iconTitle">
            <MoneyIcon />
            Salary:
          </div>
          <div className="bar salaryBar" />
        </div>
        <div className="data textAlignLeft">
          <strong>${salaryMed.toFixed(0)}K</strong> per year
        </div>

        <div className="heading">
          <div className="iconTitle">
            <SchoolIcon />
            Study:
          </div>
          <div className="bar educationBar" />
        </div>
        <div>
          <div className="data textAlignLeft">
            approx. <strong>{yearsStudy.toFixed(1)} years</strong>
          </div>
        </div>

        <div className="heading">
          <div className="iconTitle">
            <WarningIcon />
            Risk:
          </div>
          <div className="bar riskBar" />
        </div>
        <div className="data textAlignLeft">
          <strong>{(automationRisk * 100).toFixed(0)}%</strong> chance of tasks
          being replaced by machines
        </div>
      </div>
    </MobileTooltipStyles>
  );
};

const MobileTooltip = ({ data, setMobileTooltipProps }) => {
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
          <MobileTooltipContents data={data} />
        </div>
      </Drawer>
    </div>
  );
};

export default MobileTooltip;
