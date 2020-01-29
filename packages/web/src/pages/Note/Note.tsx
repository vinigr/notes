import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { hot } from 'react-hot-loader/root';
import { RouteComponentProps } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { TimeFive } from 'styled-icons/boxicons-regular/TimeFive';
import format from 'date-fns/format';

import { createQueryRenderer } from '@todo/relay-web';

import { Note_query } from './__generated__/Note_query.graphql';

interface PropsRouter {
  id: string;
}

interface Props {
  query: Note_query;
}

const NoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

const NoteContent = styled.article`
  width: 90%;
  min-width: 400px;
  max-width: 600px;
`;

const NoteTitle = styled.h1`
  margin: 0 0 10px;
`;

const TimeFiveIcon = styled(TimeFive)`
  width: 14px;
  color: #8e8e8e;
  margin-right: 4px;
`;

const NoteDate = styled.span`
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #8e8e8e;
`;

const NoteCategories = styled.div``;

const Category = styled.button<{ active: boolean }>`
  padding: 8px;
  border: none;
  border-radius: 2px;
  margin-right: 6px;
  cursor: pointer;
  outline: none;
  border: solid 0.5px #e1e1e1;
  background-color: #fff;

  &:hover {
    opacity: 0.8;
  }
`;

const Note: React.FC = ({ query }: Props) => {
  const { note } = query;
  return (
    <NoteWrapper>
      <NoteContent>
        <NoteTitle>{note?.title}</NoteTitle>
        <NoteDate>
          <TimeFiveIcon />
          {format(new Date(note.updatedAt), 'HH:mm | dd MMM yyyy')}
        </NoteDate>
        <NoteCategories>
          {note.categories.map(category => (
            <Category key={category._id}>{category.name}</Category>
          ))}
        </NoteCategories>
        <ReactMarkdown source={note?.text.replace(/\u21b5/g, '\n')} />
      </NoteContent>
    </NoteWrapper>
  );
};

const NoteFragmentContainer = createFragmentContainer(Note, {
  query: graphql`
    fragment Note_query on Query @argumentDefinitions(id: { type: "ID!" }) {
      note(id: $id) {
        id
        ... on Note {
          title
          text
          updatedAt
          categories {
            _id
            name
          }
        }
      }
    }
  `,
});

export default hot(
  createQueryRenderer(NoteFragmentContainer, Note, {
    query: graphql`
      query NoteQuery($id: ID!) {
        ...Note_query @arguments(id: $id)
      }
    `,
    queriesParams: ({ match }: RouteComponentProps<PropsRouter>) => ({
      id: match.params.id,
    }),
  }),
);
