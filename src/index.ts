/* eslint-disable no-console */

import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import emailRoutes from './routes/email';
import noteRoutes from './routes/note';
import todoRoutes from './routes/todo';
import todolistRoutes from './routes/todolist';
import userRoutes from './routes/user';

// Environment variables (.env)
dotenv.config();

// Initialize express
const app = express();

// Parser (parsing the incoming JSON data)
// ! This middleware should always be placed first
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set responses CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

// Request logger
app.use(morgan('dev'));

// Initialize helmet (set HTTP response header for security purpose)
app.use(helmet());

// Compress all responses
app.use(compression());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/todolist', todolistRoutes);
app.use('/todo', todoRoutes);
app.use('/note', noteRoutes);
app.use('/email', emailRoutes);

// Error Handling
app.use((error, req, res, next) => {
  console.error('Request error', error);

  const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const { message, data } = error;

  res.status(status).json({ message, data });
});

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'You are connected 🌴',
  });
});

/**
 * Database connexion with Mongoose
 */
// Database env variables
const { MONGO_DB_USER, MONGO_DB_PASSWORD } = process.env;

// Database URI
const DB_URI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster-node-todolist.msl8yjl.mongodb.net/`;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected');

    // Starting the server
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => console.error('DB connexion error:', error));

export default app;
