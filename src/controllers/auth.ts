import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

import User from '../models/user';

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Finding if a user already exists with this email
    const user = await User.findOne({ email });

    // If email address already used, throw an error
    if (user) {
      const error = new Error('Email address already used');
      // @ts-ignore TODO type error object
      error.statusCode = 422;
      throw error;
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
}