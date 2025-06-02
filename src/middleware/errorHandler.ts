import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  const response: ApiResponse<null> = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  };

  res.status(500).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: `Route ${req.originalUrl} not found`
  };
  
  res.status(404).json(response);
};