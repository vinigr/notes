import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createUser,
  createCategory,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not edit category if not provided new name', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!, $newName: String!) {
      CategoryEdit(input: { id: $id, newName: $newName }) {
        category {
          node {
            name
          }
        }
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: category._id.toString(),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).not.toBeUndefined();
});

it('should not edit category if user not authenticated', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!, $newName: String!) {
      CategoryEdit(input: { id: $id, newName: $newName }) {
        category {
          node {
            name
          }
        }
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: category._id.toString(),
    newName: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data?.CategoryEdit.error).toBe('User not authenticated');
});

it('should not edit category if id invalid', async () => {
  const user = await createUser();
  await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!, $newName: String!) {
      CategoryEdit(input: { id: $id, newName: $newName }) {
        category {
          node {
            name
          }
        }
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '123',
    newName: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data?.CategoryEdit.error).toBe('ID is invalid');
});

it('should not edit category if id not found', async () => {
  const user = await createUser();
  await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!, $newName: String!) {
      CategoryEdit(input: { id: $id, newName: $newName }) {
        category {
          node {
            name
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
    newName: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data?.CategoryEdit.error).toBe('Category not found');
});

it('should edit if category was user createdBy', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!, $newName: String!) {
      CategoryEdit(input: { id: $id, newName: $newName }) {
        category {
          node {
            name
          }
        }
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: category._id.toString(),
    newName: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data?.CategoryEdit.error).toBeNull();
  expect(data?.CategoryEdit.category.node.name).not.toBe(category.name);
});
