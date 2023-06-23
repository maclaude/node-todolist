import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      required: false,
    },
  },
  // createdAt - updatedAt
  { timestamps: true },
);

export default model('Todo', todoSchema);
