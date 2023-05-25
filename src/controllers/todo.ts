import { StatusCodes } from 'http-status-codes';

import Todo from '../models/todo';
import Todolist from '../models/todolist';
import { CustomError } from '../utils/customError';

export const postNewTodo = async (req, res, next) => {
  const { title, status, todolistId } = req.body;

  try {
    // Create new todo
    const newTodo = await new Todo({
      title,
      status,
    });
    const response = await newTodo.save();

    // Finding related todolist
    const todolist = await Todolist.findById(todolistId);
    // Throw an error if nothing is retrieved
    if (!todolist) {
      throw new CustomError('Could not find the related todolist', 404);
    }
    // Adding newTodo objectId to the todolist's items
    todolist.items.push(newTodo._id);
    // Saving updates
    await todolist.save();

    // Response object
    const data = {
      id: response._id.toString(),
      title: response.title,
      status: response.status,
    };

    // Sending client response
    res.status(StatusCodes.CREATED).json({
      message: 'Todo created',
      data,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
