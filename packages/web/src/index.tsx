import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import { Environment } from '@todo/relay-web';

import App from './App';

import ContextProvider from './core/ContextProvider';

const rootEl = document.getElementById('root');

if (rootEl) {
  ReactDOM.render(
    <RelayEnvironmentProvider environment={Environment}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </RelayEnvironmentProvider>,
    rootEl,
  );
} else {
  throw new Error('wrong rootEl');
}
