import { StatusCodes } from 'http-status-codes';

import Todo from '../models/todo';
import Todolist from '../models/todolist';
import User from '../models/user';
import { CustomError } from '../utils/customError';

export const getUserTodolists = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'todolists',
        populate: {
          path: 'items',
          model: 'Todo',
          populate: [
            {
              path: 'ongoing',
              model: 'Todo',
            },
            {
              path: 'complete',
              model: 'Todo',
            },
            {
              path: 'delete',
              model: 'Todo',
            },
          ],
        },
      })
      .lean();

    if (!user) {
      throw new CustomError(
        'Could not find the requested user',
        StatusCodes.NOT_FOUND,
      );
    }

    const { todolists } = user;

    if (!todolists.length) {
      res.status(StatusCodes.OK).json([]);
    } else {
      res.status(StatusCodes.OK).json(todolists);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const getUserNotes = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'notes',
      })
      .lean();

    if (!user) {
      throw new CustomError(
        'Could not find the requested user',
        StatusCodes.NOT_FOUND,
      );
    }

    const { notes } = user;

    if (!notes.length) {
      res.status(StatusCodes.OK).json([]);
    } else {
      res.status(StatusCodes.OK).json(notes);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateTodolistsOrder = async (req, res, next) => {
  const { userId } = req;
  const { newItems } = req.body;

  try {
    const updatedUserTodolists = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { todolists: newItems } },
    )
      .populate({
        path: 'todolists',
        populate: {
          path: 'items',
          model: 'Todo',
          populate: [
            {
              path: 'ongoing',
              model: 'Todo',
            },
            {
              path: 'complete',
              model: 'Todo',
            },
            {
              path: 'delete',
              model: 'Todo',
            },
          ],
        },
      })
      .lean();

    if (!updatedUserTodolists) {
      throw new CustomError(
        'Could not update the requested user todolists',
        StatusCodes.NOT_FOUND,
      );
    }

    res.status(StatusCodes.OK).json(updatedUserTodolists.todolists);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const deleteUserTodolists = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError(
        'Could not find the requested user',
        StatusCodes.NOT_FOUND,
      );
    }

    const todolistsIds = user.todolists;

    await Promise.all(
      todolistsIds.map(async (todolistId) => {
        const todolist = await Todolist.findById(todolistId);
        const todoIds = [
          ...todolist.items.ongoing,
          ...todolist.items.complete,
          ...todolist.items.delete,
        ];
        await Todo.deleteMany({ _id: { $in: todoIds } });
        await Todolist.findByIdAndDelete(todolistId);
      }),
    );

    await User.findByIdAndUpdate(userId, { todolists: [] });

    res.status(StatusCodes.OK).json();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const deleteUserNotes = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError(
        'Could not find the requested user',
        StatusCodes.NOT_FOUND,
      );
    }

    user.notes = [];
    const response = await user.save();

    res.status(StatusCodes.OK).json(response.notes);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
