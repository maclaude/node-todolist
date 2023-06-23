import { StatusCodes } from 'http-status-codes';

import Todo from '../models/todo';
import Todolist from '../models/todolist';
import { CustomError } from '../utils/customError';

export const getTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      throw new CustomError(
        'Could not find the requested todo',
        StatusCodes.NOT_FOUND,
      );
    }

    res.status(StatusCodes.OK).json(todo);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const postNewTodo = async (req, res, next) => {
  const { title, todolistId } = req.body;

  try {
    const newTodo = await new Todo({
      title,
    });
    await newTodo.save();

    const todolist = await Todolist.findById(todolistId);

    if (!todolist) {
      throw new CustomError('Could not find the related todolist', 404);
    }

    // Adding newTodo objectId to the todolist's items ongoing
    todolist.items.ongoing.push(newTodo._id);
    await todolist.save();

    res.status(StatusCodes.CREATED).json(todolist);
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

export const updateTodoStatus = async (req, res, next) => {
  const { currentStatus, newStatus, todolistId } = req.body;
  const { id } = req.params;

  try {
    const todolist = await Todolist.findByIdAndUpdate(todolistId, {
      $pull: { [`items.${currentStatus}`]: id },
      $push: { [`items.${newStatus}`]: id },
    });

    if (!todolist) {
      throw new CustomError(
        'Could not find the requested todo',
        StatusCodes.NOT_FOUND,
      );
    }

    todolist.save();

    res.status(StatusCodes.OK).json();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};

export const updateTodoDetails = async (req, res, next) => {
  const { title, notes, date, priority } = req.body;
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
    todo.notes = notes;
    todo.date = date;
    todo.priority = priority;

    const response = await todo.save();

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
