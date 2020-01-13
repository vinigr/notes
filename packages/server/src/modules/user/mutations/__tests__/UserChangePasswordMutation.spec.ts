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

it('should not change password of non authorized user', async () => {
  //language graphQL
  const query = `
    mutation M(
      $oldPassword: String!
      $password: String!
    ) {
      UserChangePassword(input: {
        oldPassword: $oldPassword
        password: $password
      }){
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    oldPassword: '123',
    password: '1234',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserChangePassword.error).toBe('User not authenticated');
});

it('should not change password if oldPassword is invalid', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M(
      $oldPassword: String!
      $password: String!
    ) {
      UserChangePassword(input: {
        oldPassword: $oldPassword
        password: $password
      }) {
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    oldPassword: '123',
    password: '1234',
  };
  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserChangePassword.error).toBe('Invalid password');
});

it('should change password if oldPassword is correct', async () => {
  const password = 'test123';
  const user = await createUser({ password });

  // language graphQL
  const query = `
    mutation M(
      $oldPassword: String!
      $password: String!      
    ) {
      UserChangePassword(input: {
        oldPassword: $oldPassword
        password: $password
      }) {
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    oldPassword: password,
    password: 'abc',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(data.UserChangePassword.error).toBeNull();
});
