import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import Loading from './components/Loading';

import AuthRoute from './components/AuthRoute';
import PrivateRoute from './components/PrivateRoute';

import { ROUTE_LOGIN, ROUTE_REGISTER, ROUTE_HOME, ROUTE_NOTE } from './helpers/constants';
import { GlobalStyle } from './styles/global';

const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Notes = lazy(() => import('./pages/Notes/Notes'));
const Note = lazy(() => import('./pages/Note/Note'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <AuthRoute path={ROUTE_LOGIN} component={Login} />
          <AuthRoute path={ROUTE_REGISTER} component={Register} />
          <PrivateRoute path={ROUTE_HOME} component={Notes} />
          <PrivateRoute path={ROUTE_NOTE} component={Note} />
        </Switch>
      </Suspense>
      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
