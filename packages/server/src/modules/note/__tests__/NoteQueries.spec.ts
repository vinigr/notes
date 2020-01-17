import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  sanitizeTestObject,
  createUser,
  createCategory,
  createNote,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not return note query if user not authenticated', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  const note = await createNote({ categories: [category._id, category2._id], author: user._id });

  // language graphQL
  const query = `
    query Q($id: ID!) {
      note(id: $id) {
        id
        _id
        title
        text
        categories {
          name
        }
      }
    }
  `;

  const rootQuery = {};
  const context = getContext();
  const variables = {
    id: note._id.toString(),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.note).toBeNull();
});

it('should not return note query if ID not found', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  await createNote({ categories: [category._id, category2._id], author: user._id });

  // language graphQL
  const query = `
    query Q($id: ID!) {
      note(id: $id) {
        id
        _id
        title
        text
        categories {
          name
        }
      }
    }  
  `;

  const rootQuery = {};
  const context = getContext({ user });
  const variables = {
    id: '123',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.note).toBeNull();
});

it('should return note query', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  const note = await createNote({ categories: [category._id, category2._id], author: user._id });

  // language graphQL
  const query = `
    query Q($id: ID!) {
      note(id: $id) {
        id
        ... on Note {
          _id
          title
          text
          categories {
            _id
            name
          }
        }
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: toGlobalId('Note', note._id),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.note.title).toBe(note.title);
  expect(result.data.note.categories).toHaveLength(2);
  expect(result.data.note.categories[0]._id).toBe(note.categories[0].toString());
  expect(result.data.note.categories[1]._id).toBe(note.categories[1].toString());
});

it('should query for my notes', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  await createNote({ author: user._id, categories: [category._id, category2._id] });
  await createNote({ author: user._id, categories: [category._id, category2._id] });
  await createNote({ author: user._id, categories: [category._id, category2._id] });
  await createNote({ author: user2._id, categories: [category._id, category2._id] });

  // language=GraphQL
  const query = `
    query{
      notesMe(first: 10){
        edges{
          node{
            title
            text
            categories{
              name
            }
          }
        }
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const result = await graphql(schema, query, rootQuery, context);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.notesMe.edges).toHaveLength(3);
});

it('should search for my notes', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  await createNote({ author: user._id, categories: [category._id, category2._id], title: 'anything' });
  await createNote({ author: user._id, categories: [category._id, category2._id], text: 'anything 123' });
  await createNote({ author: user._id, categories: [category._id, category2._id] });
  await createNote({ author: user2._id, categories: [category._id, category2._id], text: 'anything' });

  // language=GraphQL
  const query = `
    query{
      notesMe(first: 10, search: "anyth"){
        edges{
          node{
            title
            text
            categories{
              name
            }
          }
        }
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const result = await graphql(schema, query, rootQuery, context);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.notesMe.edges).toHaveLength(2);
});

it('should filter my notes by categories', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  await createNote({ author: user._id, categories: [category._id, category2._id], title: 'anything' });
  await createNote({ author: user._id, categories: [category._id, category2._id], text: 'anything 123' });
  await createNote({ author: user._id, categories: [category._id] });
  await createNote({ author: user2._id, categories: [category._id, category2._id], text: 'anything' });

  // language=GraphQL
  const query = `
    query ($categories: [String]) {
      notesMe(first: 10, categories: $categories) {
        edges {
          node {
            title
            text
            categories {
              name
            }
          }
        }
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    categories: [category._id.toString(), category2._id.toString()],
  };
  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.notesMe.edges).toHaveLength(2);
});
