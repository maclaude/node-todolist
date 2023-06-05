import { StatusCodes } from 'http-status-codes';

import Todo from '../models/todo';
import Todolist from '../models/todolist';
import { CustomError } from '../utils/customError';

export const postNewTodo = async (req, res, next) => {
  const { title, status, todolistId } = req.body;

  try {
    const newTodo = await new Todo({
      title,
      status,
    });
    const response = await newTodo.save();

    const todolist = await Todolist.findById(todolistId);

    if (!todolist) {
      throw new CustomError('Could not find the related todolist', 404);
    }

    // Adding newTodo objectId to the todolist's items
    todolist.items.push(newTodo._id);
    await todolist.save();

    res.status(StatusCodes.CREATED).json({
      message: 'Todo created',
      data: {
        id: response._id.toString(),
        title: response.title,
        status: response.status,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateTodoStatus = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      throw new CustomError(
        'Could not find the requested todo',
        StatusCodes.NOT_FOUND,
      );
    }

    todo.status = status;

    const response = await todo.save();

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

export const updateTodoTitle = async (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      throw new CustomError(
        'Could not find the requested todo',
        StatusCodes.NOT_FOUND,
      );
    }

    todo.title = title;

    const response = await todo.save();

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
