import React from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.button`
  padding: 10px;
  background: #40c573;
  outline: none;
  border: none;
  cursor: pointer;
  margin: 16px 0;
  border-radius: 2px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

interface ButtonProps {
  children: string;
  onClick: (e: any) => void;
}

const Button = (props: ButtonProps) => <ButtonWrapper onClick={props.onClick}>{props.children}</ButtonWrapper>;

export default Button;
