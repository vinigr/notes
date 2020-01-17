import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType, { UserConnection } from '../modules/user/UserType';
import CategoryType, { CategoryConnection } from '../modules/category/CategoryType';
import NoteType, { NoteConnection } from '../modules/note/NoteType';

import { nodeField } from '../interface/NodeInterface';
import { UserLoader, CategoryLoader, NoteLoader } from '../loader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (_, __, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    category: {
      type: CategoryType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, context) => {
        const { id } = fromGlobalId(args.id);
        return CategoryLoader.load(context, id);
      },
    },
    note: {
      type: NoteType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, args, context) => {
        const { id } = fromGlobalId(args.id);
        return NoteLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (_, args, context) => UserLoader.loadUsers(context, args),
    },
    categoriesByCreator: {
      type: CategoryConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (_, args, context) => (context.user ? CategoryLoader.loadCategoriesByCreator(context, args) : null),
    },
    categories: {
      type: CategoryConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (_, args, context) => CategoryLoader.loadCategories(context, args),
    },
    notesMe: {
      type: NoteConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
        categories: {
          type: GraphQLList(GraphQLString),
        },
      },
      resolve: (_, args, context) => NoteLoader.loadMeNotes(context, args),
    },
    notes: {
      type: NoteConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (_, args, context) => NoteLoader.loadNotes(context, args),
    },
  }),
});
