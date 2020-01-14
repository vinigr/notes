import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const CategoryType = registerType(
  new GraphQLObjectType({
    name: 'Category',
    description: 'Category Data',
    fields: () => ({
      id: globalIdField('Category'),
      _id: {
        type: GraphQLString,
        resolve: category => category._id,
      },
      name: {
        type: GraphQLString,
        resolve: category => category.name,
      },
      createdBy: {
        type: GraphQLString,
        resolve: (obj, args, context) => {
          const { user } = context;

          return obj.createdBy.equals(user._id);
        },
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
