import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  CATEGORY: {
    ADDED: 'CATEGORY_ADDED',
  },
};

export default new PubSub();
