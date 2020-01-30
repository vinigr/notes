import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import SEO from '../../SEO';

import { login } from '../../helpers/auth';
import Context from '../../core/context';

import Input from '../../components/Input';
import ButtonAuth from '../../components/ButtonAuth';

import { ROUTE_LOGIN, ROUTE_HOME } from '../../helpers/constants';

import { FormAuthWrapper } from '../../components/FormAuthWrapper';

import UserRegisterWithEmailMutation from './UserRegisterWithEmailMutation';
import { UserRegisterWithEmailMutationResponse } from './__generated__/UserRegisterWithEmailMutation.graphql';

export const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const history = useHistory();
  const { handleLogged } = useContext(Context);

  const handleRegister = e => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    if (!name || !email || !password) {
      return setError('Incomplete credentials');
    }

    const input = {
      name,
      email,
      password,
    };

    const onCompleted = (response: UserRegisterWithEmailMutationResponse) => {
      setLoading(false);
      if (!response.UserRegisterWithEmail) return;

      const { error, token } = response.UserRegisterWithEmail;

      error && setError(error);

      if (token) {
        login(token, rememberMe);
        history.push(ROUTE_HOME);
        handleLogged();
      }
    };

    const onError = () => {
      setError('Something goes wrong with login');

      setLoading(false);
    };

    UserRegisterWithEmailMutation.commit(input, onCompleted, onError);
  };

  return (
    <Wrapper>
      <FormAuthWrapper>
        <SEO title={'Register'} url={'/register'} />
        <h1>Register</h1>
        <h2>Name</h2>
        <Input type="text" value={name} onChange={e => setName(e.target.value)} />
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
        <ButtonAuth onClick={handleRegister}>Register</ButtonAuth>
        {error && <h3>{error}</h3>}
        <Link to={ROUTE_LOGIN}>Login</Link>
      </FormAuthWrapper>
    </Wrapper>
  );
};

export default Login;
