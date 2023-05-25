import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { CustomError } from '../utils/customError';

/**
 * Authentication middleware
 */
export const isAuth = (req, res, next) => {
  // Checking for Authorization in the req header
  const authHeader = req.get('Authorization');

  // If no Authorization, throw an error
  if (!authHeader) {
    throw new CustomError('Not authenticated', StatusCodes.UNAUTHORIZED);
  }

  // Getting the token
  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    // Checking token validity
    decodedToken = jwt.verify(token, 'secret');
  } catch (error) {
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    throw error;
  }

  // If token isn't valid, throw an error
  if (!decodedToken) {
    throw new CustomError('Token is not valid', StatusCodes.UNAUTHORIZED);
  }

  // Extracting information from the token
  req.userId = decodedToken.userId;

  next();
};
