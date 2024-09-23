import { Request, Response, NextFunction } from 'express';
import { HttpException } from 'src/backend/utils/HttpException';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let status = 500;
  let message = 'Internal Server Error';

  if (error instanceof HttpException) {
    status = error.status;
    message = error.message;
  }

  // Log the error for debugging and monitoring purposes
  console.error(`[Error] ${status} - ${message}`);
  console.error(error.stack);

  const errorResponse: any = {
    status,
    message,
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(status).json(errorResponse);
};