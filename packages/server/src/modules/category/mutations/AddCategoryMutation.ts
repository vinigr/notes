import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { GraphQLContext } from '../../../TypeDefinition';

import CategoryModel from '../CategoryModel';
import { CategoryConnection } from '../CategoryType';
import * as CategoryLoader from '../CategoryLoader';

interface AddCategoryArgs {
  name: string;
}

const mutation = mutationWithClientMutationId({
  name: 'AddCategory',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ name }: AddCategoryArgs, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    const category = new CategoryModel({
      name,
      createdBy: user._id,
    });

    await category.save();

    return {
      id: category._id,
      error: null,
    };
  },
  outputFields: {
    category: {
      type: CategoryConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newCategory = await CategoryLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newCategory) {
          return null;
        }

        return {
          cursor: toGlobalId('Category', newCategory._id),
          node: newCategory,
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
