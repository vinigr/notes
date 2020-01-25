import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router';

import { isLoggedIn } from '../helpers/auth';

import { ROUTE_HOME } from '../helpers/constants';

interface AuthRouteProps extends RouteProps {
  component: any;
}

const AuthRoute: React.FunctionComponent<AuthRouteProps> = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (!isLoggedIn() ? <Component {...props} /> : <Redirect to={ROUTE_HOME} />)} />
  );
};

export default AuthRoute;
