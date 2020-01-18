import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import mongoose from 'mongoose';

import { GraphQLContext } from '../../../TypeDefinition';
import NoteModel from '../NoteModel';

const mutation = mutationWithClientMutationId({
  name: 'NoteDelete',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ id }, { user }: GraphQLContext) => {
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

    await note.remove();

    return {
      id,
    };
  },
  outputFields: {
    id: {
      type: GraphQLString,
      resolve: ({ id }) => id,
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
