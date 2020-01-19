import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import pubSub, { EVENTS } from '../../../pubSub';

import { NoteConnection } from '../NoteType';
import * as NoteLoader from '../NoteLoader';

import { GraphQLContext } from '../../../TypeDefinition';
import NoteModel from '../NoteModel';

interface NoteAddArgs {
  title: string;
  text: string;
  categories: Array<string>;
}

const mutation = mutationWithClientMutationId({
  name: 'NoteAdd',
  inputFields: {
    title: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLNonNull(GraphQLString),
    },
    categories: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
    },
  },
  mutateAndGetPayload: async ({ title, text, categories }: NoteAddArgs, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    const note = new NoteModel({
      title,
      text,
      categories: [...new Set(categories)],
      author: user._id,
    });

    await note.save();

    pubSub.publish(EVENTS.NOTE.ADDED, { NoteAdded: { note } });

    return {
      id: note._id,
    };
  },
  outputFields: {
    note: {
      type: NoteConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newNote = await NoteLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newNote) {
          return null;
        }

        return {
          cursor: toGlobalId('Note', newNote._id),
          node: newNote,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
