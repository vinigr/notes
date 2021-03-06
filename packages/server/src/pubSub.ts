import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  CATEGORY: {
    ADDED: 'CATEGORY_ADDED',
    EDITED: 'CATEGORY_EDITED',
    DELETED: 'CATEGORY_DELETED',
  },
  NOTE: {
    ADDED: 'NOTE_ADDED',
    EDITED: 'NOTE_EDITED',
    DELETED: 'NOTE_DELETED',
  },
};

export default new PubSub();
