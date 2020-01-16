import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import UserType from '../user/UserType';
import { UserLoader } from '../../loader';

const CategoryType = registerType(
  new GraphQLObjectType({
    name: 'Category',
    description: 'Category Data',
    fields: () => ({
      id: globalIdField('Category'),
      _id: {
        type: GraphQLString,
        resolve: category => category._id.toString(),
      },
      name: {
        type: GraphQLString,
        resolve: category => category.name,
      },
      createdBy: {
        type: UserType,
        resolve: (obj, _, context) => {
          const { user } = context;
          if (obj.createdBy.equals(user._id)) {
            return UserLoader.load(context, user._id);
          }

          return null;
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
      },
      updatedAt: {
        type: GraphQLString,
        resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default CategoryType;

export const CategoryConnection = connectionDefinitions({
  name: 'Category',
  nodeType: GraphQLNonNull(CategoryType),
});
