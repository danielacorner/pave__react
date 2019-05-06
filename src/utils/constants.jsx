import React from 'react';
import styled from 'styled-components';

export const MOBILE_MIN_WIDTH = 360;
export const MOBLET_MIN_WIDTH = 475;
export const TABLET_MIN_WIDTH = 675;
export const NEVER_MIN_WIDTH = 999999;
export const TOOLTIP_WIDTH = 280;
export const TOOLTIP_HZ_OFFSET = 40;
export const SLIDER_WIDTH_LG = 200;
export const SLIDER_WIDTH_MD = 125;
export const FILTER_TITLE = filterVar => {
  switch (filterVar) {
    case 'skillsLang':
      return 'Language & Communication Skills';
    case 'skillsLogi':
      return 'Logic & Reasoning Skills';
    case 'skillsMath':
      return 'Math & Spatial Skills';
    case 'skillsComp':
      return 'Computer & Information Skills';
    default:
      return;
  }
};

const SliderTooltipStyles = styled.div`
  .sliderTooltip {
    span {
      text-decoration: underline;
    }
  }
`;
export const SLIDER_TOOLTIP_TEXT = filterVar => {
  switch (filterVar) {
    // TODO:
    case 'skillsLang':
      return (
        <SliderTooltipStyles>
          <div className="sliderTooltip">
            <span>Oral Communication:</span> Verbally expressing ideas and
            information to others.
          </div>
          <div className="sliderTooltip">
            <span>Reading:</span> Understanding written materials.
          </div>
          <div className="sliderTooltip">
            <span>Writing:</span> Expressing ideas in writing.
          </div>
        </SliderTooltipStyles>
      );
    case 'skillsLogi':
      return (
        <SliderTooltipStyles>
          <div className="sliderTooltip">
            <span>Decision Making:</span> Making a choice from different options
            by using information.
          </div>
          <div className="sliderTooltip">
            <span>Job Task Planning and Organizing:</span> Planning and
            organizing one{"'"}s own work.
          </div>
          <div className="sliderTooltip">
            <span>Problem Solving:</span> Identifying and breaking down problems
            into solvable steps.
          </div>
          <div className="sliderTooltip">
            <span>Critical Thinking:</span> Making judgments by using standards
            to evaluate ideas, information, and related results.
          </div>
        </SliderTooltipStyles>
      );
    case 'skillsMath':
      return (
        <SliderTooltipStyles>
          <div className="sliderTooltip">
            <span>Measurement and Calculation:</span> Measuing and calculating
            amounts, areas, volumes, distances.
          </div>
          <div className="sliderTooltip">
            <span>Money Math:</span> Using math skills to deal with money, such
            as handling cash, preparing bills, making payments.
          </div>
          <div className="sliderTooltip">
            <span>Number Estimation:</span> Quickly guessing answers to
            arithmetic questions (addition, subtraction, multiplication,
            division).
          </div>
          <div className="sliderTooltip">
            <span>Scheduling, Budgeting, Accounting:</span> Planning for the
            best use of time and money, and monitoring the use of time and
            money.
          </div>
        </SliderTooltipStyles>
      );
    case 'skillsComp':
      return (
        <SliderTooltipStyles>
          <div className="sliderTooltip">
            <span>Data Analysis:</span> Gathering and analyzing numerical or
            categorical data.
          </div>
          <div className="sliderTooltip">
            <span>Finding Information:</span> Searching through various sources
            to figure out how to complete a task.
          </div>
          <div className="sliderTooltip">
            <span>Digital Technology:</span> Using any type of digital
            technology.
          </div>
          <div className="sliderTooltip">
            <span>Document Use:</span> Using different types of material
            (labels, signs, lists, tables, graphs, forms, diagrams,
            blueprints...) to gather information.
          </div>
        </SliderTooltipStyles>
      );
    default:
      return;
  }
};
export const FILTER_RANGE = filterVar => {
  switch (filterVar) {
    case 'skillsLang':
      return [0, 75];
    case 'skillsLogi':
      return [0, 75];
    case 'skillsMath':
      return [0, 75];
    case 'skillsComp':
      return [0, 75];

    case 's1DataAnalysis':
    case 's2DecisionMaking':
    case 's3FindingInformation':
    case 's4JobTaskPlanningandOrganizing':
    case 's5MeasurementandCalculation':
    case 's6MoneyMath':
    case 's7NumericalEstimation':
    case 's8OralCommunication':
    case 's9ProblemSolving':
    case 's10Reading':
    case 's11SchedulingorBudgetingandAccounting':
    case 's12DigitalTechnology':
    case 's13DocumentUse':
    case 's14Writing':
    case 's15CriticalThinking':
      return [0, 25];
    default:
      return;
  }
};

export const SUBSKILL_FILTER_TITLES = filterVar => {
  switch (filterVar) {
    case 'skillsLang':
      return [
        { title: 'Oral Communication', dataLabel: 's8OralCommunication' },
        { title: 'Reading', dataLabel: 's10Reading' },
        { title: 'Writing', dataLabel: 's14Writing' },
      ];
    case 'skillsLogi':
      return [
        { title: 'Decision-Making', dataLabel: 's2DecisionMaking' },
        {
          title: 'Task Planning & Organizing',
          dataLabel: 's4JobTaskPlanningandOrganizing',
        },
        { title: 'Problem Solving', dataLabel: 's9ProblemSolving' },
        { title: 'Critical Thinking', dataLabel: 's15CriticalThinking' },
      ];
    case 'skillsMath':
      return [
        {
          title: 'Measurement & Calculation',
          dataLabel: 's5MeasurementandCalculation',
        },
        { title: 'Money Math', dataLabel: 's6MoneyMath' },
        { title: 'Numerical Estimation', dataLabel: 's7NumericalEstimation' },
        {
          title: 'Scheduling, Budgeting, Accounting',
          dataLabel: 's11SchedulingorBudgetingandAccounting',
        },
      ];
    case 'skillsComp':
      return [
        { title: 'Finding Information', dataLabel: 's3FindingInformation' },
        { title: 'Document Use', dataLabel: 's13DocumentUse' },
        { title: 'Digital Technology', dataLabel: 's12DigitalTechnology' },
        { title: 'Data Analysis', dataLabel: 's1DataAnalysis' },
      ];
    default:
      return;
  }
};
