import { Router } from 'express';
import { AuthController } from 'src/backend/controllers/AuthController';
import { validateRequest } from 'src/backend/middleware/validateRequest';
import { authSchema } from 'src/backend/schemas/authSchema';
import { rateLimiter } from 'src/backend/middleware/rateLimiter';

const createAuthRouter = (): Router => {
  // Create a new Express Router instance
  const router = Router();

  // Create an instance of AuthController
  const authController = new AuthController();

  // Define rate limiter for authentication routes
  const authRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
  });

  // Set up POST /auth/verify route with rate limiting, request validation, and controller method
  router.post(
    '/verify',
    authRateLimiter,
    validateRequest(authSchema.verify),
    authController.sendVerificationCode
  );

  // Set up POST /auth/login route with rate limiting, request validation, and controller method
  router.post(
    '/login',
    authRateLimiter,
    validateRequest(authSchema.login),
    authController.login
  );

  // Set up POST /auth/register route with rate limiting, request validation, and controller method
  router.post(
    '/register',
    authRateLimiter,
    validateRequest(authSchema.register),
    authController.register
  );

  // Return the configured router
  return router;
};

export const router = createAuthRouter();