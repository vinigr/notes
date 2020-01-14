import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { ICategory } from './modules/category/CategoryModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  CategoryLoader: Dataloader<Key, ICategory>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
};
