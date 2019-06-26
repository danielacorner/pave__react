import React from 'react';
import { NavBar } from '../NavBar';

test('renders', () => {
  expect(<NavBar />).toMatchSnapshot();
});
