// @flow
/* eslint-disable no-multi-assign,prefer-const */

import { User, Category } from '../../src/models';
import { IUser } from '../../src/modules/user/UserModel';
import { ICategory } from '../../src/modules/category/CategoryModel';

export const restartCounters = () => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce((prev, curr) => ({ ...prev, [curr]: 0 }), {});
};

export const createUser = async (payload: Partial<IUser> = {}) => {
  const n = (global.__COUNTERS__.user += 1);

  return new User({
    name: `Normal user ${n}`,
    email: `user-${n}@example.com`,
    password: '123456',
    active: true,
    ...payload,
  }).save();
};

export const createCategory = async (payload: Partial<ICategory> = {}) => {
  const n = (global.__COUNTERS__.category += 1);

  return new Category({
    name: `Category ${n}`,
    ...payload,
  }).save();
};
