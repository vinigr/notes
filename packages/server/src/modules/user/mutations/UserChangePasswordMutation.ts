import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import UserType from '../UserType';
import * as UserLoader from '../UserLoader';

import { GraphQLContext } from '../../../TypeDefinition';

interface UserChangePasswordArgs {
  oldPassword: string;
  password: string;
}

const mutation = mutationWithClientMutationId({
  name: 'UserChangePassword',
  inputFields: {
    oldPassword: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ oldPassword, password }: UserChangePasswordArgs, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    const correctPassword = user.authenticate(oldPassword);

    if (!correctPassword) {
      return {
        error: 'Invalid password',
      };
    }

    user.password = password;
    await user.save();

    return {
      error: null,
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    me: {
      type: UserType,
      resolve: ({ obj, args, context }) => UserLoader.load(context, context.user.id),
    },
  },
});

export default {
  ...mutation,
};
