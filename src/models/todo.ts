import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  // createdAt - updatedAt
  { timestamps: true },
);

export default model('Todo', todoSchema);
