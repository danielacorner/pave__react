export const TOOLTIP_WIDTH = 280;
export const TOOLTIP_HZ_OFFSET = 40;
export const SLIDER_WIDTH_LG = 200;
export const SLIDER_WIDTH_MD = 125;
export const FILTER_TITLE = filterVar => {
  switch (filterVar) {
    case 'skillsLang':
      return 'Language & Communication';
    case 'skillsLogi':
      return 'Logic & Reasoning';
    case 'skillsMath':
      return 'Math & Spatial';
    case 'skillsComp':
      return 'Computer & Information';
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
