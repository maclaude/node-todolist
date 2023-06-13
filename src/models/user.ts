import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    todolists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Todolist',
      },
    ],
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  // createdAt - updatedAt
  { timestamps: true },
);

export default model('User', userSchema);
