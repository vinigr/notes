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
  sanitizeTestObject,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should query an category', async () => {
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
          createdBy
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
  expect(data.category.name).toBe(category.name);
});
