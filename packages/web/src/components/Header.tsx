import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { AddBox } from 'styled-icons/material/AddBox';
import { Exit } from 'styled-icons/boxicons-solid/Exit';

import { ROUTE_HOME, ROUTE_CREATE_NOTE, ROUTE_LOGIN } from '../helpers/constants';

import Context from '../core/context';

import { logout } from '../helpers/auth';

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #548596;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  min-width: 250px;
  max-width: 600px;
`;

const Link = styled(NavLink)`
  color: #d5ece1;
  text-decoration: none;
  font-size: 20px;
  font-weight: 600;

  &[aria-current] {
    color: #fff;
  }
`;

const AddBoxIcon = styled(AddBox)`
  width: 40px;
`;

const ButtonExit = styled.button`
  width: 40px;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
`;

const ExitIcon = styled(Exit)`
  width: 40px;
  color: #fff;
`;

const Header = () => {
  const history = useHistory();
  const { handleLogged } = useContext(Context);

  const handleLogout = () => {
    logout();
    history.push(ROUTE_LOGIN);
    handleLogged();
  };

  return (
    <Wrapper>
      <Nav>
        <Link to={ROUTE_HOME}>Notes</Link>
        <div>
          <Link to={ROUTE_CREATE_NOTE}>
            <AddBoxIcon />
          </Link>
          <ButtonExit title="Logout" onClick={handleLogout}>
            <ExitIcon />
          </ButtonExit>
        </div>
      </Nav>
    </Wrapper>
  );
};

export default Header;
