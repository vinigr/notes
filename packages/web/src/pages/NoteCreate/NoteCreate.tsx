import React, { useState } from 'react';
import { convertToRaw } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import SEO from '../../SEO';

import SelectCategories from './SelectCategories';

import Editor from './EditorText';

import { NoteAddMutationResponse } from './__generated__/NoteAddMutation.graphql';
import NoteAddMutation from './NoteAddMutation';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  min-width: 300px;
  max-width: 600px;
`;

const Input = styled.input`
  padding: 14px 8px;
  border-radius: 4px;
  border: 1px solid #f1f1f1;
  margin-bottom: 10px;
  outline: none;
  font-size: 18px;
`;

const ButtonCreate = styled.button`
  padding: 10px;
  background-color: #60b36d;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  align-self: flex-end;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const NoteCreate = () => {
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [editorState, setEditorState] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const history = useHistory();

  const onEditorStateChange: Function = text => {
    setEditorState(text);
  };

  const create = e => {
    e.preventDefault();

    if (!title || !categories?.length || categories?.length === 0) {
      return setError('Title or categories not inserted');
    }

    const text = editorState && draftToMarkdown(convertToRaw(editorState.getCurrentContent())).replace(/\↵/g, '\n');

    if (!text) {
      return setError('Text not inserted');
    }

    setLoading(true);

    const input = {
      title,
      categories: categories.map(category => category.value),
      text,
    };

    const onCompleted = (response: NoteAddMutationResponse) => {
      setLoading(false);
      if (!response.NoteAdd) return;

      const { error, note } = response.NoteAdd;

      error && setError(error);

      if (note) {
        history.push(`/note/${note?.node.id}`);
      }
    };

    const onError = () => {
      setLoading(false);
      setError('Something goes wrong with registration of the category');

      setLoading(false);
    };

    NoteAddMutation.commit(input, onCompleted, onError);
  };

  return (
    <Wrapper>
      <Form>
        <SEO title={'New Note'} url={`/create-note`} />
        <Input type="text" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
        <SelectCategories onChange={option => setCategories(option)} categoriesSelected={categories} />
        <Editor onEditorStateChange={onEditorStateChange} />
        <ButtonCreate onClick={e => create(e)}>Create</ButtonCreate>
        {error && <h3>{error}</h3>}
      </Form>
    </Wrapper>
  );
};

export default NoteCreate;
