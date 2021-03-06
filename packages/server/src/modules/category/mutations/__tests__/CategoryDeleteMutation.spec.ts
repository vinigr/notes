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

it('should not delete category if user not authenticated', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!) {
      CategoryDelete(input: { id: $id }) {
        id
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
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.CategoryDelete.error).toBe('User not authenticated');
});

it('should not delete category if user not createdBy', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!) {
      CategoryDelete(input: { id: $id }) {
        id
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext({ user: user2 });
  const variables = {
    id: category._id.toString(),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.CategoryDelete.error).toBe('User not authorized');
});

it('should not delete category if id invalid', async () => {
  const user = await createUser();
  await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!) {
      CategoryDelete(input: { id: $id }) {
        id
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '123',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.CategoryDelete.error).toBe('ID is invalid');
});

it('should not delete category if id not found', async () => {
  const user = await createUser();
  await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!) {
      CategoryDelete(input: { id: $id }) {
        id
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '53cb6b9b4f4ddef1ad47f943',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.CategoryDelete.error).toBe('Category not found');
});

it('should delete if category was user createdBy', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    mutation m($id: String!) {
      CategoryDelete(input: { id: $id }) {
        id
        error
      }
    } 
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: category._id.toString(),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.CategoryDelete.error).toBeNull();
  expect(data.CategoryDelete.id).toBe(category._id.toString());
});
