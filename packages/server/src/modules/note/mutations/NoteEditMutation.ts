import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import mongoose from 'mongoose';

import { NoteConnection } from '../NoteType';
import * as NoteLoader from '../NoteLoader';

import { GraphQLContext } from '../../../TypeDefinition';
import NoteModel from '../NoteModel';

interface NoteAddArgs {
  id: string;
  title: string;
  text: string;
  categories: Array<string>;
}

const mutation = mutationWithClientMutationId({
  name: 'NoteEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
  mutateAndGetPayload: async ({ id, title, text, categories }: NoteAddArgs, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        error: 'ID is invalid',
      };
    }

    const note = await NoteModel.findById(id);

    if (!note) {
      return {
        error: 'Note not found',
      };
    }

    if (note.author.toString() !== user._id.toString()) {
      return {
        error: 'User not authorized',
      };
    }

    note.title = title;
    note.text = text;
    note.categories = [...new Set(categories)];

    await note.save();

    return {
      id: note._id,
    };
  },
  outputFields: {
    note: {
      type: NoteConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const editNote = await NoteLoader.load(context, id);

        // Returns null if no node was loaded
        if (!editNote) {
          return null;
        }

        return {
          cursor: toGlobalId('Note', editNote._id),
          node: editNote,
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
