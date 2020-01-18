import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createUser,
  createCategory,
  createNote,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not edit note if user not authenticated', async () => {
  // language graphQL
  const query = `
    mutation M(
      $id: String!
      $title: String
      $text: String!
      $categories: [String!]
    ) {
      NoteEdit(
        input: { id: $id, title: $title, text: $text, categories: $categories }
      ) {
        note {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: '1',
    text: 'test',
    categories: ['123'],
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteEdit.error).toBe('User not authenticated');
});

it('should not edit note if id is invalid', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M(
      $id: String!
      $title: String
      $text: String!
      $categories: [String!]
    ) {
      NoteEdit(
        input: { id: $id, title: $title, text: $text, categories: $categories }
      ) {
        note {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '1',
    text: 'test',
    categories: ['123'],
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteEdit.error).toBe('ID is invalid');
});

it('should not edit note if id not found', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M(
      $id: String!
      $title: String
      $text: String!
      $categories: [String!]
    ) {
      NoteEdit(
        input: { id: $id, title: $title, text: $text, categories: $categories }
      ) {
        note {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '53cb6b9b4f4ddef1ad47f943',
    text: 'test',
    categories: ['123'],
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteEdit.error).toBe('Note not found');
});

it('should not edit note if user not is author', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  const note = await createNote({ author: user._id, text: 'teste', categories: [category._id, category2._id] });

  // language graphQL
  const query = `
    mutation M(
      $id: String!
      $title: String
      $text: String!
      $categories: [String!]
    ) {
      NoteEdit(
        input: { id: $id, title: $title, text: $text, categories: $categories }
      ) {
        note {
          node {
            title
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user: user2 });
  const variables = {
    id: note._id.toString(),
    text: 'test',
    categories: [category._id.toString()],
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteEdit.error).toBe('User not authorized');
});

it('should edit note', async () => {
  const newTitle = 'anything';
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  const note = await createNote({ author: user._id, text: 'teste', categories: [category._id, category2._id] });

  // language graphQL
  const query = `
    mutation M(
      $id: String!
      $title: String
      $text: String!
      $categories: [String!]
    ) {
      NoteEdit(
        input: { id: $id, title: $title, text: $text, categories: $categories }
      ) {
        note {
          node {
            title
            categories {
              name
            }
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: note._id.toString(),
    title: newTitle,
    text: 'test',
    categories: [category._id.toString()],
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.NoteEdit.error).toBeNull();
  expect(data.NoteEdit.note.node.title).toBe(newTitle);
  expect(data.NoteEdit.note.node.categories).toHaveLength(1);
});
