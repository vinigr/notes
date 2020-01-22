import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('root');

if (rootEl) {
  ReactDOM.render(<h1>Hello</h1>, rootEl);
} else {
  throw new Error('wrong rootEl');
}
