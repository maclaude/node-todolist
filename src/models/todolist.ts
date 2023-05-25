import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const todolistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Todo',
      },
    ],
  },
  // createdAt - updatedAt
  { timestamps: true },
);

export default model('Todolist', todolistSchema);
