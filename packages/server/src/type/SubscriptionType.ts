import { GraphQLObjectType } from 'graphql';

import CategorySubscriptions from '../modules/category/subscriptions';
import NoteSubscriptions from '../modules/note/subscriptions';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    ...CategorySubscriptions,
    ...NoteSubscriptions,
  },
});
