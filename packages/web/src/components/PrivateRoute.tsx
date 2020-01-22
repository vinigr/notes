import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router';

import { isLoggedIn } from '../helpers/auth';

import { ROUTE_LOGIN } from '../helpers/constants';

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (isLoggedIn() ? <Component {...props} /> : <Redirect to={ROUTE_LOGIN} />)} />
  );
};

export default PrivateRoute;
