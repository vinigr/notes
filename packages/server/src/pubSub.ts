import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  CATEGORY: {
    ADDED: 'CATEGORY_ADDED',
    EDITED: 'CATEGORY_EDITED',
    DELETED: 'CATEGORY_DELETED',
  },
};

export default new PubSub();
