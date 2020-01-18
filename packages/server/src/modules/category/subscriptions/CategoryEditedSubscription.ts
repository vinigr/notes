import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';
import { withFilter } from 'graphql-subscriptions';

import { CategoryConnection } from '../CategoryType';
import pubSub, { EVENTS } from '../../../pubSub';

const CategoryEditedPayloadType = new GraphQLObjectType({
  name: 'CategoryEditedPayload',
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

const categoryEditedSubscription = {
  type: CategoryEditedPayloadType,
  subscribe: withFilter(
    () => pubSub.asyncIterator(EVENTS.CATEGORY.EDITED),
    async (payload, _, { user }) => {
      return payload.CategoryEdited.category.createdBy.toString() === user.id;
    },
  ),
};

export default categoryEditedSubscription;
