import { GraphQLObjectType, GraphQLString } from 'graphql';
import { withFilter } from 'graphql-subscriptions';

import pubSub, { EVENTS } from '../../../pubSub';

const NoteDeletedPayloadType = new GraphQLObjectType({
  name: 'NoteDeletedPayload',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({ note }) => note._id.toString(),
    },
  }),
});

const noteDeletedSubscription = {
  type: NoteDeletedPayloadType,
  subscribe: withFilter(
    () => pubSub.asyncIterator(EVENTS.NOTE.DELETED),
    async (payload, _, { user }) => {
      return payload.NoteDeleted.note.author.toString() === user.id;
    },
  ),
};

export default noteDeletedSubscription;
