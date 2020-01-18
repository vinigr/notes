import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import mongoose from 'mongoose';

import { GraphQLContext } from '../../../TypeDefinition';

import pubSub, { EVENTS } from '../../../pubSub';

import CategoryModel from '../CategoryModel';

const mutation = mutationWithClientMutationId({
  name: 'CategoryDelete',
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

    const category = await CategoryModel.findById(id);

    if (!category) {
      return {
        error: 'Category not found',
      };
    }

    if (category?.createdBy.toString() !== user._id.toString()) {
      return {
        error: 'User not authorized',
      };
    }

    await category?.remove();

    pubSub.publish(EVENTS.CATEGORY.DELETED, { CategoryDeleted: { category } });

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
