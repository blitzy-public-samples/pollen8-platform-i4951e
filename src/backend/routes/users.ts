import { Router } from 'express';
import { UserController } from 'src/backend/controllers/UserController';
import { validateRequest } from 'src/backend/middleware/validateRequest';
import { userSchema } from 'src/backend/schemas/userSchema';
import { authMiddleware } from 'src/backend/middleware/auth';
import { rateLimiter } from 'src/backend/middleware/rateLimiter';

const createUserRouter = (): Router => {
  const router = Router();
  const userController = new UserController();

  // Define rate limiter for user routes
  const userRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

  // Apply authMiddleware to all routes to ensure authentication
  router.use(authMiddleware);

  // Set up GET /users/profile route with controller method
  router.get('/profile', userRateLimiter, userController.getUserProfile);

  // Set up PUT /users/profile route with request validation and controller method
  router.put('/profile', userRateLimiter, validateRequest(userSchema.updateProfile), userController.updateUserProfile);

  // Set up GET /users/connections route with controller method
  router.get('/connections', userRateLimiter, userController.getUserConnections);

  // Set up POST /users/connections route with request validation and controller method
  router.post('/connections', userRateLimiter, validateRequest(userSchema.addConnection), userController.addUserConnection);

  // Set up GET /users/network-value route with controller method
  router.get('/network-value', userRateLimiter, userController.getNetworkValue);

  return router;
};

export const router = createUserRouter();