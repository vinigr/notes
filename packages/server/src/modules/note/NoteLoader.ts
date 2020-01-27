import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import mongoose, { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import { GraphQLContext } from '../../TypeDefinition';

import { ICategory } from '../category/CategoryModel';

import NoteModel, { INote } from './NoteModel';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class Note {
  id: string;

  _id: Types.ObjectId;

  title: string | null;

  text: string | null | undefined;

  categories: Array<ICategory> | null | undefined;

  author: mongoose.Schema.Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: INote, { user }: GraphQLContext) {
    this.id = data._id;
    this._id = data._id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.author = null;
    this.title = null;

    if (user && user._id.equals(data.author)) {
      this.title = data.title;
      this.text = data.text;
      this.categories = data.categories;
      this.author = data.author;
    }
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(NoteModel, ids));

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  id: string | Record<string, any> | ObjectId,
): Promise<Note | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;

  try {
    data = await context.dataloaders.NoteLoader.load(id as string);
  } catch (error) {
    return null;
  }
  return viewerCanSee() ? new Note(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.NoteLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: INote) =>
  dataloaders.NoteLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: INote) =>
  clearCache(context, id) && primeCache(context, id, data);

type NoteArgs = ConnectionArguments & {
  search?: string;
  categories?: Array<string>;
};

export const loadMeNotes = async (context: GraphQLContext, args: NoteArgs) => {
  let where = { author: context.user?._id };

  if (args.search) {
    const search = args.search.toLowerCase().trim();

    const searchRegex = {
      $or: [
        {
          title: {
            $regex: search,
            $options: 'ig',
          },
        },
        {
          text: {
            $regex: search,
            $options: 'ig',
          },
        },
      ],
    };

    where = Object.assign(where, searchRegex);
  }

  if (args.categories?.length > 0) {
    Object.assign(where, { categories: { $all: args.categories } });
  }

  const notes = NoteModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: notes,
    context,
    args,
    loader: load,
  });
};

export const loadNotes = async (context: GraphQLContext, args: NoteArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const notes = NoteModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: notes,
    context,
    args,
    loader: load,
  });
};
