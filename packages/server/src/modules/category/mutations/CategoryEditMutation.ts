import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';
import mongoose from 'mongoose';

import { GraphQLContext } from '../../../TypeDefinition';

import pubSub, { EVENTS } from '../../../pubSub';

import CategoryModel from '../CategoryModel';
import { CategoryConnection } from '../CategoryType';
import * as CategoryLoader from '../CategoryLoader';

interface EditCategoryArgs {
  newName: string;
  id: string;
}

const mutation = mutationWithClientMutationId({
  name: 'CategoryEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    newName: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ id, newName }: EditCategoryArgs, { user }: GraphQLContext) => {
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

    category.name = newName;

    await category.save();

    return {
      id: category._id,
    };
  },
  outputFields: {
    category: {
      type: CategoryConnection.edgeType,
      resolve: async ({ id }, args, context) => {
        const editCategory = await CategoryLoader.load(context, id);

        // Returns null if no node was loaded
        if (!editCategory) {
          return null;
        }

        pubSub.publish(EVENTS.CATEGORY.EDITED, { CategoryEdited: { category: editCategory } });

        return {
          cursor: toGlobalId('Category', editCategory._id),
          node: editCategory,
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
