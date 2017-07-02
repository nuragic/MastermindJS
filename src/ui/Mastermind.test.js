import React from 'react';
import ReactDOM from 'react-dom';
import Mastermind from './Mastermind';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Mastermind />, div);
});
