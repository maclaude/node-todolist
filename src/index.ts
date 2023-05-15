import bodyParser from "body-parser";
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

// Environment variables (.env)
dotenv.config();

// Initialize express
const app = express();

// Parser (parsing the incoming JSON data)
// ! This middleware should always be placed first
app.use(bodyParser.json());

// Set responses CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

// Request logger
app.use(morgan("dev"));

// Initialize helmet (set HTTP response header for security purpose)
app.use(helmet());

// Compress all responses
app.use(compression());

app.get("/", (req, res) => {
  res.json({title: "Hello World !"});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
