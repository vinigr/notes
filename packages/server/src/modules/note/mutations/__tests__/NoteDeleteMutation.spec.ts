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

it('should not delete note if user not authenticated', async () => {
  // language graphQL
  const query = `
    mutation M(
      $id: String!
    ) {
      NoteDelete(
        input: { id: $id }
      ) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext();
  const variables = {
    id: '1',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteDelete.error).toBe('User not authenticated');
});

it('should not delete note if id is invalid', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M(
      $id: String!
    ) {
      NoteDelete(
        input: { id: $id }
      ) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: '1',
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteDelete.error).toBe('ID is invalid');
});

it('should not delete note if note not found', async () => {
  const user = await createUser();

  // language graphQL
  const query = `
    mutation M(
      $id: String!
    ) {
      NoteDelete(
        input: { id: $id }
      ) {
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

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteDelete.error).toBe('Note not found');
});

it('should not delete note if user not is author', async () => {
  const user = await createUser();
  const user2 = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  const note = await createNote({ author: user._id, text: 'teste', categories: [category._id, category2._id] });

  // language graphQL
  const query = `
    mutation M(
      $id: String!
    ) {
      NoteDelete(
        input: { id: $id }
      ) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user: user2 });
  const variables = {
    id: note._id.toString(),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);

  expect(result.errors).toBeUndefined();
  expect(result.data.NoteDelete.error).toBe('User not authorized');
});

it('should delete note', async () => {
  const user = await createUser();
  const category = await createCategory({ createdBy: user._id });
  const category2 = await createCategory({ createdBy: user._id });
  const note = await createNote({ author: user._id, text: 'teste', categories: [category._id, category2._id] });

  // language graphQL
  const query = `
    mutation M(
      $id: String!
    ) {
      NoteDelete(
        input: { id: $id }
      ) {
        id
        error
      }
    }
  `;

  const rootQuery = {};
  const context = await getContext({ user });
  const variables = {
    id: note._id.toString(),
  };

  const result = await graphql(schema, query, rootQuery, context, variables);
  const { data } = result;

  expect(result.errors).toBeUndefined();
  expect(data.NoteDelete.error).toBeNull();
  expect(data.NoteDelete.id).toBe(note._id.toString());
});
