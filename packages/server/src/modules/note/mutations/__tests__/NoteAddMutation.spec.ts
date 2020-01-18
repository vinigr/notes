import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createUser,
  createCategory,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not create note if user not authenticate', async () => {
  // language graphQL
  const query = `
    mutation M($title: String, $text: String!, $categories: [String!]) {
      NoteAdd(input: {title: $title, text: $text, categories: $categories}) {
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
    text: 'test',
    categories: ['123'],
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteAdd.error).toBe('User not authenticated');
});

it('should not create note if categories ids are invalid', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M($title: String, $text: String!, $categories: [String!]) {
      NoteAdd(input: {title: $title, text: $text, categories: $categories}) {
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
    text: 'test',
    categories: ['1234'],
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).not.toBeUndefined();
});

it('should create note', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation M($title: String, $text: String!, $categories: [String!]) {
      NoteAdd(input: {title: $title, text: $text, categories: $categories}) {
        note {
          node {
            text
          }
        }
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    text: 'test',
    categories: [category._id.toString(), category2._id.toString()],
  };
  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.errors).toBeUndefined();
  expect(result.data.NoteAdd.note.node.text).toBe('test');
});
