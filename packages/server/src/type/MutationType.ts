import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutations';
import CategoryMutations from '../modules/category/mutations';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    //User
    ...UserMutations,
    ...CategoryMutations,
  }),
});
