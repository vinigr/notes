import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { ICategory } from './modules/category/CategoryModel';
import { INote } from './modules/note/NoteModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  CategoryLoader: Dataloader<Key, ICategory>;
  NoteLoader: Dataloader<Key, INote>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
};
