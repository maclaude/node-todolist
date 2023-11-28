import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { CustomError } from '../utils/customError';

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Finding if a user already exists with this email
    const user = await User.findOne({ email });

    // If email address already used, throw an error
    if (user) {
      throw new CustomError(
        'Email address already used',
        StatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    // Encrypting password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating new user
    const newUser = await new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const response = await newUser.save();

    // Sending client response
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'User created', userId: response._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    // Next to reach the error middleware
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Finding current user by email & Fetching user's projects data
    const user = await User.findOne({ email }).lean();

    // Throw an error if nothing is retrieved
    if (!user) {
      return res.status(StatusCodes.OK).json({
        error: {
          code: 1,
          message: 'Aucune utilisateur trouvé avec cet email',
        },
      });
    }

    // Comparing passwords
    const passwordsMatched = await bcrypt.compare(password, user.password);
    // Throw an error if passwords don't match
    if (!passwordsMatched) {
      return res.status(StatusCodes.OK).json({
        error: {
          code: 2,
          message: 'Mot de passe incorrect',
        },
      });
    }

    // Generating token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'secret',
      { expiresIn: '72h' },
    );

    // Response object
    const response = {
      id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    // Sending client response
    return res.status(StatusCodes.OK).json({ token, user: response });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    return next(error);
  }
};
