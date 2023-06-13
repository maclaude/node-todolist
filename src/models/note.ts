import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  // createdAt - updatedAt
  { timestamps: true },
);

export default model('Note', noteSchema);
