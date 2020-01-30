import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import Loading from './components/Loading';
import Header from './components/Header';

import AuthRoute from './components/AuthRoute';
import PrivateRoute from './components/PrivateRoute';

import { ROUTE_LOGIN, ROUTE_REGISTER, ROUTE_HOME, ROUTE_NOTE, ROUTE_CREATE_NOTE } from './helpers/constants';
import { GlobalStyle } from './styles/global';

import Context from './core/context';

const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Notes = lazy(() => import('./pages/Notes/Notes'));
const Note = lazy(() => import('./pages/Note/Note'));
const CreateNote = lazy(() => import('./pages/NoteCreate/NoteCreate'));

const App: React.FC = () => {
  const { isLogged } = useContext(Context);

  return (
    <BrowserRouter>
      {isLogged && <Header />}
      <Suspense fallback={<Loading />}>
        <Switch>
          <AuthRoute path={ROUTE_LOGIN} component={Login} />
          <AuthRoute path={ROUTE_REGISTER} component={Register} />
          <PrivateRoute exact path={ROUTE_HOME} component={Notes} />
          <PrivateRoute path={ROUTE_NOTE} component={Note} />
          <PrivateRoute path={ROUTE_CREATE_NOTE} component={CreateNote} />
        </Switch>
      </Suspense>
      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
