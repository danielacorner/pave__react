import React from 'react';
import FiltersPanel from '../FiltersPanel';

test('renders', () => {
  expect(<FiltersPanel />).toMatchSnapshot();
});
