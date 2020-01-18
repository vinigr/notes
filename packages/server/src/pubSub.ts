import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  CATEGORY: {
    ADDED: 'CATEGORY_ADDED',
    EDITED: 'CATEGORY_EDITED',
  },
};

export default new PubSub();
