import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.input`
  padding: 10px;
  box-shadow: 1px 21px 130px 2px rgba(235, 235, 235, 0.4);
  outline-color: #c4c4c4;
  border: #eee solid 0.5px;
  font-weight: 500;
`;

interface InputProps {
  value: string;
  type: string;
  onChange: (string) => void;
}

const Input = (props: InputProps) => <InputWrapper {...props} />;

export default Input;
