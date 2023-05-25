import { StatusCodes } from 'http-status-codes';

export class CustomError extends Error {
  statusCode: StatusCodes;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
  }
}
