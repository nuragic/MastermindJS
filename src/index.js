import React from 'react';
import ReactDOM from 'react-dom';
import Mastermind from './ui/Mastermind';

const rootNode = document.getElementById('root');

const restartFn = () => {
  ReactDOM.unmountComponentAtNode(rootNode);
  ReactDOM.render(<Mastermind level="medium" restart={restartFn} />, rootNode);
}

ReactDOM.render(<Mastermind level="medium" restart={restartFn} />, rootNode);