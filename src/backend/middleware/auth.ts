import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from 'src/backend/services/AuthService.ts';
import { HttpException } from 'src/backend/utils/HttpException.ts';
import { JWT_SECRET } from 'src/backend/config/constants.ts';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpException(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    // Verify the JWT token using the JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (!decoded) {
      throw new HttpException(401, 'Invalid token');
    }

    // Extract the userId from the decoded token
    const { userId } = decoded;

    // Use AuthService to verify the token and get the user
    const authService = new AuthService();
    const user = await authService.verifyToken(token);

    if (!user) {
      throw new HttpException(401, 'User not found');
    }

    // Attach the user object to the request
    (req as any).user = user;

    // Call next() to pass control to the next middleware
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpException(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};