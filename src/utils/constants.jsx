export const TOOLTIP_WIDTH = 300;
export const TOOLTIP_HZ_OFFSET = 40;
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
      return [{title:'Language & Communication'}];
    case 'skillsLogi':
      return [{title:'Logic & Reasoning'}];
    case 'skillsMath':
      return [{title:'Math & Spatial'}];
    case 'skillsComp':
      return [{title:'Computer & Information'}];
    default:
      return;
  }
};
