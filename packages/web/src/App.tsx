import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import Loading from './components/Loading';

import AuthRoute from './components/AuthRoute';

import { ROUTE_LOGIN } from './helpers/constants';

const Login = lazy(() => import('./pages/Login/Login'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <AuthRoute path={ROUTE_LOGIN} component={Login} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
