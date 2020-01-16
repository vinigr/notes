import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createUser,
} from '../../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should not add category if user not authenticated', async () => {
  // language graphQL
  const query = `
    mutation M(
      $name: String!
    ) {
      AddCategory(input: {
        name: $name
      }) {
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
    name: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.AddCategory.category).toBeNull();
  expect(data.AddCategory.error).toBe('User not authenticated');
});

it('should add category', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M($name: String!) {
      AddCategory(input: {name: $name}) {
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
    name: 'test',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { AddCategory } = result.data;

  console.log(result.data);

  expect(result.errors).toBeUndefined();
  expect(AddCategory.category.node.name).toBe('test');
});
