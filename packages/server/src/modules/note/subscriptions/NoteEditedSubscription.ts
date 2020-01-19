import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';
import { withFilter } from 'graphql-subscriptions';

import { NoteConnection } from '../NoteType';
import pubSub, { EVENTS } from '../../../pubSub';

const NoteEditedPayloadType = new GraphQLObjectType({
  name: 'NoteEditedPayload',
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

const noteEditedSubscription = {
  type: NoteEditedPayloadType,
  subscribe: withFilter(
    () => pubSub.asyncIterator(EVENTS.NOTE.EDITED),
    async (payload, _, { user }) => {
      return payload.NoteEdited.note.author.toString() === user.id;
    },
  ),
};

export default noteEditedSubscription;
