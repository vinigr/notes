import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';
import { withFilter } from 'graphql-subscriptions';

import { CategoryConnection } from '../CategoryType';
import pubSub, { EVENTS } from '../../../pubSub';

const CategoryAddedPayloadType = new GraphQLObjectType({
  name: 'CategoryAddedPayload',
  fields: () => ({
    categoryEdge: {
      type: CategoryConnection.edgeType,
      resolve: ({ category }) => ({
        cursor: offsetToCursor(category.id),
        node: category,
      }),
    },
  }),
});

const categoryAddedSubscription = {
  type: CategoryAddedPayloadType,
  subscribe: withFilter(
    () => pubSub.asyncIterator(EVENTS.CATEGORY.ADDED),
    async (payload, _, { user }) => {
      return payload.CategoryAdded.category.createdBy.toString() === user.id;
    },
  ),
};

export default categoryAddedSubscription;
