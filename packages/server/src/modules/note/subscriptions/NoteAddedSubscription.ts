import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';
import { withFilter } from 'graphql-subscriptions';

import { NoteConnection } from '../NoteType';
import pubSub, { EVENTS } from '../../../pubSub';

const NoteAddedPayloadType = new GraphQLObjectType({
  name: 'NoteAddedPayload',
  fields: () => ({
    noteEdge: {
      type: NoteConnection.edgeType,
      resolve: ({ note }) => ({
        cursor: offsetToCursor(note.id),
        node: note,
      }),
    },
  }),
});

const noteAddedSubscription = {
  type: NoteAddedPayloadType,
  subscribe: withFilter(
    () => pubSub.asyncIterator(EVENTS.NOTE.ADDED),
    async (payload, _, { user }) => {
      return payload.NoteAdded.note.author.toString() === user.id;
    },
  ),
};

export default noteAddedSubscription;
