import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import Loading from './components/Loading';

import AuthRoute from './components/AuthRoute';

import { ROUTE_LOGIN, ROUTE_REGISTER } from './helpers/constants';
import { GlobalStyle } from './styles/global';

const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <AuthRoute path={ROUTE_LOGIN} component={Login} />
          <AuthRoute path={ROUTE_REGISTER} component={Register} />
        </Switch>
      </Suspense>
      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
