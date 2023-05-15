import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import authRoutes from './routes/auth';

// Environment variables (.env)
dotenv.config();

// Initialize express
const app = express();

// Parser (parsing the incoming JSON data)
// ! This middleware should always be placed first
app.use(bodyParser.json());

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

app.get('/home', (req, res) => {
  res.json({ title: 'Hello World !' });
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
  .catch((error) => console.log('Error:', error));
