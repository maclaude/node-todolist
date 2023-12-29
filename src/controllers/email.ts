import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import nodemailer from 'nodemailer';

// Environment variables (.env)
dotenv.config();

const { NODEMAILER_AUTH_USER, NODEMAILER_AUTH_PASSWORD } = process.env;

// Nodemailer setup using a Gmail account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_AUTH_USER,
    pass: NODEMAILER_AUTH_PASSWORD,
  },
});

export const sendEmail = async (req, res, next) => {
  const { to, subject, text } = req.body;

  // Email options
  const mailOptions = {
    from: 'itsmarcocld@gmail.com',
    to,
    subject,
    text,
  };

  try {
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.toString() });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: `Email sent: ${info.response}` });
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }

    next(error);
  }
};
