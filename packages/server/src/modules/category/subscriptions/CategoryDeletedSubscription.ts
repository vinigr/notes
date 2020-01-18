import { GraphQLObjectType, GraphQLString } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import pubSub, { EVENTS } from '../../../pubSub';

const CategoryDeletedPayloadType = new GraphQLObjectType({
  name: 'CategoryDeletedPayload',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({ category }) => category._id.toString(),
    },
  }),
});

const categoryDeletedSubscription = {
  type: CategoryDeletedPayloadType,
  subscribe: withFilter(
    () => pubSub.asyncIterator(EVENTS.CATEGORY.DELETED),
    async (payload, _, { user }) => {
      return payload.CategoryDeleted.category.createdBy.toString() === user.id;
    },
  ),
};

export default categoryDeletedSubscription;
