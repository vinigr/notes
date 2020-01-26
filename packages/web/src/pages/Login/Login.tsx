import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import SEO from '../../SEO';

import { login } from '../../helpers/auth';

import Input from '../../components/Input';
import ButtonAuth from '../../components/ButtonAuth';

import { ROUTE_REGISTER, ROUTE_HOME } from '../../helpers/constants';

import { FormAuthWrapper } from '../../components/FormAuthWrapper';

import UserLoginWithEmailMutation from './UserLoginWithEmailMutation';
import { UserLoginWithEmailMutationResponse } from './__generated__/UserLoginWithEmailMutation.graphql';

export const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const history = useHistory();

  const handleLogin = e => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    if (!email || !password) {
      return setError('Incomplete credentials');
    }

    const input = {
      email,
      password,
    };

    const onCompleted = (response: UserLoginWithEmailMutationResponse) => {
      setLoading(false);
      if (!response.UserLoginWithEmail) return;

      const { error, token } = response.UserLoginWithEmail;

      error && setError(error);

      if (token) {
        login(token, rememberMe);
        history.push(ROUTE_HOME);
      }
    };

    const onError = () => {
      setError('Something goes wrong with login');

      setLoading(false);
    };

    UserLoginWithEmailMutation.commit(input, onCompleted, onError);
  };

  return (
    <Wrapper>
      <FormAuthWrapper>
        <SEO title={'Login'} url={'/login'} />
        <h1>Login</h1>
        <h2>Email</h2>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <h2>Password</h2>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div id="checkbox">
          <input
            type="checkbox"
            id="remember"
            defaultChecked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <ButtonAuth onClick={handleLogin}>Login</ButtonAuth>
        {error && <h3>{error}</h3>}
        <Link to={ROUTE_REGISTER}>Register me</Link>
      </FormAuthWrapper>
    </Wrapper>
  );
};

export default Login;
