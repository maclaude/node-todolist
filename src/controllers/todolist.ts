import { StatusCodes } from 'http-status-codes';

import Todolist from '../models/todolist';
import User from '../models/user';
import { CustomError } from '../utils/customError';

export const postNewTodolist = async (req, res, next) => {
  const { title, status, userId } = req.body;

  try {
    // Create new todolist
    const newTodolist = await new Todolist({
      title,
      status,
    });
    const response = await newTodolist.save();

    // Finding creator user
    const user = await User.findById(userId);
    // Throw an error if nothing is retrieved
    if (!user) {
      throw new CustomError('Could not find the related user', 404);
    }
    // Adding newTodolist objectId to user's todolists
    user.todolists.push(newTodolist._id);
    // Saving updates
    await user.save();

    // Response object
    const data = {
      id: response._id.toString(),
      title: response.title,
      status: response.status,
    };

    // Sending client response
    res.status(StatusCodes.CREATED).json({
      message: 'Todolist created',
      data,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
