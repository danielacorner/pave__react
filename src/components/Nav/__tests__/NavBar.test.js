import React from 'react';
import { Navbar } from '../Navbar';

test('renders', () => {
  expect(<Navbar />).toMatchSnapshot();
});
