import { StatusCodes } from 'http-status-codes';

import User from '../models/user';
import { CustomError } from '../utils/customError';

export const getUserTodolists = async (req, res, next) => {
  const { userId } = req;

  try {
    // Finding current user data
    const user = await User.findById(userId)
      .populate({
        path: 'todolists',
        populate: {
          path: 'items',
          model: 'Todo',
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

    // Sending client response
    if (!todolists.length) {
      res.status(204).json({
        message: 'No todolist founded',
      });
    } else {
      res.status(200).json({
        message: `${todolists.length} todolists found`,
        todolists,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
