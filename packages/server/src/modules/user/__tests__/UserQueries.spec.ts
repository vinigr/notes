import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createUser,
  disconnectMongoose,
  getContext,
  sanitizeTestObject,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('UserType queries', () => {
  it('should query an user', async () => {
    const user = await createUser();

    // language=GraphQL
    const query = `
      query Q($id: ID!) {
        user: node(id: $id) {
          id
          ... on User {
            id
            name
            email
          }
        }
      }
    `;

    const variables = {
      id: toGlobalId('User', user._id),
    };
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should query all users', async () => {
    await createUser();
    await createUser();
    await createUser();
    await createUser();
    await createUser();

    // language=GraphQL
    const query = `
      query {
        users(first: 10) {
          edges {
            node {
              id
              name
              email
            }
          }
        }
      }
    `;

    const rootValue = {};
    const context = await getContext();

    const result = await graphql(schema, query, rootValue, context);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should search all users', async () => {
    await createUser({ name: 'grama' });
    await createUser({ email: 'vinigrama@teste.com' });
    await createUser({ name: 'oliveira' });
    await createUser({ name: 'Vinícios Grama' });

    // language=GraphQL
    const query = `
      query{
        users(first: 10, search: "grama"){
          edges{
            node{
              id
              name
              email
            }
          }
        }
      }
    `;

    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should not show email of other users', async () => {
    const userA = await createUser();
    const userB = await createUser();

    // language=GraphQL
    const query = `
      query Q{
        users(first: 2){
          edges {
            node {
              _id
              name
              email
              active
            }
          }
        }
      }
    `;

    const rootValue = {};
    const context = await getContext({ user: userA });
    const result = await graphql(schema, query, rootValue, context);
    const { edges } = result.data.users;

    expect(edges[0].node.name).toBe(userB.name);
    expect(edges[0].node.email).toBe(null);

    expect(edges[1].node.name).toBe(userA.name);
    expect(edges[1].node.email).toBe(userA.email);
  });

  it('should return the current user when user is logged in', async () => {
    const user = await createUser();

    // language=GraphQL
    const query = `
      query {
        me {
          id
          name
          email
        }
      }
    `;

    const rootValue = {};
    const context = await getContext({ user });
    const result = await graphql(schema, query, rootValue, context);
    const { me } = result.data;

    expect(me.name).toBe(user.name);
    expect(me.email).toBe(user.email);
  });

  it('should return a user with active status and email null', async () => {
    const user = await createUser();

    // language graphQl
    const query = `
      query Q($id: ID!){
        user(id: $id) {
          id
          name
          email
          active
        }
      }
    `;

    const rootValue = {};
    const context = await getContext();
    const variables = {
      id: toGlobalId('User', user.id),
    };
    const result = await graphql(schema, query, rootValue, context, variables);
    const { data } = result;

    expect(data.user.name).toBe(user.name);
    expect(data.user.email).toBe(null);
    expect(data.user.active).toBe(null);
  });
});
