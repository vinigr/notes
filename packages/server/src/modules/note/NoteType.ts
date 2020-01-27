import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import CategoryType from '../category/CategoryType';
import UserType from '../user/UserType';
import { UserLoader } from '../../loader';
import CategoryModel from '../category/CategoryModel';

const NoteType = registerType(
  new GraphQLObjectType({
    name: 'Note',
    description: 'Note Data',
    fields: () => ({
      id: globalIdField('Note'),
      _id: {
        type: GraphQLString,
        resolve: note => note._id.toString(),
      },
      title: {
        type: GraphQLString,
        resolve: note => note.title,
      },
      text: {
        type: GraphQLNonNull(GraphQLString),
        resolve: note => note.text,
      },
      categories: {
        type: GraphQLNonNull(GraphQLList(CategoryType)),
        resolve: async (obj, args, context) => {
          const categories = await CategoryModel.find({ _id: { $in: obj.categories } });
          return categories;
        },
      },
      author: {
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
        resolve: ({ updatedAt }) => (updatedAt ? updatedAt.toISOString() : null),
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default NoteType;

export const NoteConnection = connectionDefinitions({
  name: 'Note',
  nodeType: GraphQLNonNull(NoteType),
});
