import React from 'react';
import { DebounceInput } from 'react-debounce-input';

import styled from 'styled-components';

const Input = styled(DebounceInput)`
  width: calc(90% - 20px);
  min-width: 250px;
  max-width: 580px;
  padding: 16px 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: solid 1px #e6e6e6;
  box-shadow: 0px 0px 14px -6px rgba(0, 0, 0, 0.3);
  font-size: 16px;
  outline: none;
`;

interface InputProps {
  onChange: (string) => void;
}

const Search = ({ onChange }: InputProps) => (
  <Input type="text" placeholder="search..." minLength={3} debounceTimeout={500} onChange={onChange} />
);

export default Search;
