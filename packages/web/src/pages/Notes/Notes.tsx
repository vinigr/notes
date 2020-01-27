import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { graphql, createRefetchContainer } from 'react-relay';
import format from 'date-fns/format';

import styled from 'styled-components';
import { TimeFive } from 'styled-icons/boxicons-regular/TimeFive';

import { createQueryRenderer } from '@todo/relay-web';

import SEO from '../../SEO';

import Search from './Search';

import { Notes_query } from './__generated__/Notes_query.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ListWrapper = styled.ul`
  display: flex;
  width: 90%;
  min-width: 400px;
  max-width: 600px;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
`;

const NoteWrapper = styled.li`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 14px 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px 0px rgba(224, 218, 218, 0.6);

  &:hover {
    box-shadow: 0px 3px 10px 3px rgba(216, 216, 216, 0.7);
  }
`;

const NoteTitle = styled.h2`
  font-size: 20px;
  margin: 0;
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

const Categories = styled.div``;

const Category = styled.button<{ active: boolean }>`
  padding: 8px;
  border: none;
  border-radius: 2px;
  margin-right: 6px;
  cursor: pointer;
  outline: none;
  border: solid 0.5px #e1e1e1;
  background-color: #${props => (props.active ? '2ACC7A' : 'FFF')};

  &:hover {
    opacity: 0.8;
  }
`;

const LinkAccess = styled(Link)`
  text-decoration: none;
  padding: 4px;
  align-self: flex-end;
  color: #2a497a;
`;

interface Props {
  query: Notes_query;
  relay: any;
}

const NoteList = ({ query, relay }: Props) => {
  const [categoriesFilter, setCategoriesFilter] = useState([]);

  const { notesMe } = query;

  const filterByCategory = (id: string) => {
    const index = categoriesFilter.indexOf(id);

    let tempCategories = [...categoriesFilter];

    if (index !== -1) {
      tempCategories = tempCategories.filter(item => item !== id);
    } else {
      tempCategories.push(id);
    }

    setCategoriesFilter(tempCategories);

    const refetchVariables = () => ({
      first: 20,
      categories: tempCategories,
    });

    relay.refetch(refetchVariables);
  };

  const handleSearch = text => {
    const refetchVariables = fragmentVariables => ({
      first: fragmentVariables.first,
      categories: fragmentVariables.categories,
      search: text,
    });

    relay.refetch(refetchVariables);
  };

  const renderItem = ({ node }) => {
    return (
      <NoteWrapper key={node.id}>
        <NoteTitle>{node.title}</NoteTitle>
        <NoteDate>
          <TimeFiveIcon />
          {format(new Date(note.updatedAt), 'HH:mm | dd MMM yyyy')}
        </NoteDate>
        <Categories>
          {node.categories.map(category => (
            <Category
              key={category._id}
              onClick={() => filterByCategory(category._id)}
              active={categoriesFilter.includes(category._id)}
            >
              {category.name}
            </Category>
          ))}
        </Categories>
        <LinkAccess to={`/note/${node.id}`}>Access</LinkAccess>
      </NoteWrapper>
    );
  };

  return (
    <Wrapper>
      <SEO title={'Notes'} url={'/notes'} />
      <Search onChange={e => handleSearch(e.target.value)} />
      <ListWrapper>
        {notesMe && Array.isArray(notesMe.edges) && notesMe.edges.length > 0
          ? notesMe.edges.map(item => renderItem(item))
          : null}
      </ListWrapper>
    </Wrapper>
  );
};

const NoteRefetchContainer = createRefetchContainer(
  NoteList,
  {
    query: graphql`
      fragment Notes_query on Query
        @argumentDefinitions(first: { type: Int }, search: { type: String }, categories: { type: "[String]" }) {
        notesMe(first: $first, search: $search, categories: $categories) @connection(key: "App_notesMe", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              updatedAt
              categories {
                _id
                name
              }
            }
          }
        }
      }
    `,
  },

  graphql`
    query NotesPaginationQuery($first: Int, $search: String, $categories: [String]) {
      ...Notes_query @arguments(first: $first, search: $search, categories: $categories)
    }
  `,
);

export default hot(
  createQueryRenderer(NoteRefetchContainer, NoteList, {
    query: graphql`
      query NotesQuery($first: Int, $search: String, $categories: [String]) {
        ...Notes_query @arguments(first: $first, search: $search, categories: $categories)
      }
    `,
    variables: { first: 20, categories: null, search: null },
  }),
);
