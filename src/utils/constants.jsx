export const TOOLTIP_WIDTH = 300;
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
    default:
      return;
  }
};

export const SUBSKILL_FILTER_TITLES = filterVar => {
  switch (filterVar) {
    case 'skillsLang':
      return [
        { title: 'Oral Communication' },
        { title: 'Reading' },
        { title: 'Writing' },
      ];
    case 'skillsLogi':
      return [
        { title: 'Decision-Making' },
        { title: 'Task Planning & Organizing' },
        { title: 'Problem Solving' },
        { title: 'Critical Thinking' },
      ];
    case 'skillsMath':
      return [
        { title: 'Measurement & Calculation' },
        { title: 'Money Math' },
        { title: 'Numerical Estimation' },
        { title: 'Scheduling, Budgeting, Accounting' },
      ];
    case 'skillsComp':
      return [
        { title: 'Finding Information' },
        { title: 'Document Use' },
        { title: 'Digital Technology' },
        { title: 'Data Analysis' },
      ];
    default:
      return;
  }
};
