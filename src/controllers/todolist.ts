import { StatusCodes } from 'http-status-codes';

import Todolist from '../models/todolist';
import User from '../models/user';
import { CustomError } from '../utils/customError';

export const getTodolist = async (req, res, next) => {
  const { id } = req.params;

  try {
    const todolist = await Todolist.findById(id).populate({
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
    });

    if (!todolist) {
      throw new CustomError(
        'Could not find the requested todolist',
        StatusCodes.NOT_FOUND,
      );
    }

    res.status(StatusCodes.OK).json(todolist);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const postNewTodolist = async (req, res, next) => {
  const { title, status, userId } = req.body;

  try {
    const newTodolist = await new Todolist({
      title,
      status,
    });
    const response = await newTodolist.save();

    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError('Could not find the related user', 404);
    }

    // Adding newTodolist objectId to user's todolists
    user.todolists.push(newTodolist._id);
    await user.save();

    res.status(StatusCodes.CREATED).json({
      id: response._id.toString(),
      title: response.title,
      status: response.status,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateTodolistStatus = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const todolist = await Todolist.findById(id);

    if (!todolist) {
      throw new CustomError(
        'Could not find the requested todolist',
        StatusCodes.NOT_FOUND,
      );
    }

    todolist.status = status;
    const response = await todolist.save();

    res.status(StatusCodes.OK).json({
      id: response._id.toString(),
      status: response.status,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateTodolistTitle = async (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    const todolist = await Todolist.findById(id);

    if (!todolist) {
      throw new CustomError(
        'Could not find the requested todolist',
        StatusCodes.NOT_FOUND,
      );
    }

    todolist.title = title;
    const response = await todolist.save();

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
