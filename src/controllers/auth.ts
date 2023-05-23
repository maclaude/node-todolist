import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Finding if a user already exists with this email
    const user = await User.findOne({ email });

    // If email address already used, throw an error
    if (user) {
      throw new Error('Email address already used');
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
    res.status(201).json({ message: 'User created', userId: response._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
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
      throw new Error('User not foun with given email');
    }

    // Comparing passwords
    const passwordsMatched = await bcrypt.compare(password, user.password);
    // Throw an error if passwords don't match
    if (!passwordsMatched) {
      throw new Error('Incorect password');
    }

    // Generating token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'secret',
      { expiresIn: '12h' },
    );

    // Response object
    const response = {
      id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    // Sending client response
    res.status(200).json({ token, user: response });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};
