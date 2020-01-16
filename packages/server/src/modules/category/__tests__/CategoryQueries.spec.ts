import { graphql } from 'graphql';
import { toGlobalId, fromGlobalId } from 'graphql-relay';

import { schema } from '../../../schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createUser,
  createCategory,
  disconnectMongoose,
  getContext,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should query an category and not return createdBy if created by what others users', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    query Q($id: ID!) {
      category(id: $id) {
        id
        ... on Category {
          id
          name
          createdBy {
            _id 
            name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({ user: user2 });
  const variables = {
    id: toGlobalId('Category', category._id),
  };

  const result = await graphql(schema, query, rootValue, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.category.createdBy).toBeNull();
});

it('should query an category created by me', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });

  // language graphQL
  const query = `
    query Q($id: ID!) {
      category(id: $id) {
        id
        ... on Category {
          id
          name
          createdBy {
            _id 
            name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({ user });
  const variables = {
    id: toGlobalId('Category', category._id),
  };

  const result = await graphql(schema, query, rootValue, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.category.createdBy._id).toBe(category.createdBy.toString());
});

it('should query all categories created by me', async () => {
  const user = await createUser();
  const user2 = await createUser();
  await createCategory({ createdBy: user._id });
  await createCategory({ createdBy: user._id });
  await createCategory({ createdBy: user2._id });

  // language=GraphQL
  const query = `
    query {
      categoriesByCreator(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({ user });

  const result = await graphql(schema, query, rootValue, context);
  const { edges } = result.data.categoriesByCreator;

  expect(result.errors).toBeUndefined();
  expect(edges).toHaveLength(2);
});

it('should not return categories by creator if user not authenticated', async () => {
  const user = await createUser();
  const user2 = await createUser();
  await createCategory({ name: 'test1', createdBy: user._id });
  await createCategory({ name: 'test2', createdBy: user._id });
  await createCategory({ name: 'test3', createdBy: user2._id });

  // language=GraphQL
  const query = `
    query{
      categoriesByCreator {
        edges{
          node{
            id
            name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext();
  const result = await graphql(schema, query, rootValue, context);

  const { categoriesByCreator } = result.data;

  expect(result.errors).toBeUndefined();
  expect(categoriesByCreator).toBeNull();
});

it('should search all categories created by me', async () => {
  const user = await createUser();
  const user2 = await createUser();
  await createCategory({ name: 'test1', createdBy: user._id });
  await createCategory({ name: 'test2', createdBy: user._id });
  await createCategory({ name: 'test3', createdBy: user2._id });

  // language=GraphQL
  const query = `
    query{
      categoriesByCreator(first: 10, search: "test"){
        edges{
          node{
            id
            name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({ user });
  const result = await graphql(schema, query, rootValue, context);

  const { edges } = result.data.categoriesByCreator;

  expect(result.errors).toBeUndefined();
  expect(edges).toHaveLength(2);
});

it('should query all categories', async () => {
  const user = await createUser();
  const user2 = await createUser();
  await createCategory({ createdBy: user._id });
  await createCategory({ createdBy: user._id });
  await createCategory({ createdBy: user2._id });

  // language=GraphQL
  const query = `
    query {
      categories(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { edges } = result.data.categories;

  expect(result.errors).toBeUndefined();
  expect(edges).toHaveLength(3);
});
