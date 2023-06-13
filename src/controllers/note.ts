import { StatusCodes } from 'http-status-codes';

import Note from '../models/note';
import User from '../models/user';
import { CustomError } from '../utils/customError';

export const getNote = async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      throw new CustomError(
        'Could not find the requested note',
        StatusCodes.NOT_FOUND,
      );
    }

    res.status(StatusCodes.OK).json(note);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const postNewNote = async (req, res, next) => {
  const { userId } = req;
  const { title, content } = req.body;

  try {
    const newNote = await new Note({
      title,
      content,
    });
    await newNote.save();

    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError(
        'Could not find the requested user',
        StatusCodes.NOT_FOUND,
      );
    }

    user.notes.push(newNote._id);
    user.save();

    res.status(StatusCodes.CREATED).json(newNote);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateNoteTitle = async (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      throw new CustomError(
        'Could not find the requested note',
        StatusCodes.NOT_FOUND,
      );
    }

    note.title = title;
    const response = await note.save();

    res.status(StatusCodes.OK).json({
      id: response._id.toString(),
      title: response.title,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateNoteContent = async (req, res, next) => {
  const { content } = req.body;
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      throw new CustomError(
        'Could not find the requested note',
        StatusCodes.NOT_FOUND,
      );
    }

    note.content = content;
    const response = await note.save();

    res.status(StatusCodes.OK).json({
      id: response._id.toString(),
      content: response.content,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
