import { GraphQLObjectType } from 'graphql';

import CategorySubscriptions from '../modules/category/subscriptions';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    ...CategorySubscriptions,
  },
});
