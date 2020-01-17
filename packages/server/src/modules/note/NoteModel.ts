import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export interface INote extends Document {
  title: string | null;
  text: string;
  categories: mongoose.Schema.Types.ObjectId[];
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteModel: Model<INote> = mongoose.model('Note', schema);

export default NoteModel;
