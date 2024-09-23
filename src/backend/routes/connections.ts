import { Router } from 'express';
import { ConnectionController } from 'src/backend/controllers/ConnectionController.ts';
import { validateRequest } from 'src/backend/middleware/validateRequest.ts';
import { connectionSchema } from 'src/backend/schemas/connectionSchema.ts';
import { authMiddleware } from 'src/backend/middleware/auth.ts';
import { rateLimiter } from 'src/backend/middleware/rateLimiter.ts';

const createConnectionRouter = (): Router => {
  // Create a new Express Router instance
  const router = Router();

  // Create an instance of ConnectionController
  const connectionController = new ConnectionController();

  // Define rate limiter for connection routes
  const connectionRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

  // Apply authMiddleware to all routes to ensure authentication
  router.use(authMiddleware);

  // Set up GET /connections route with controller method for retrieving user's connections
  router.get(
    '/connections',
    connectionRateLimiter,
    connectionController.getUserConnections
  );

  // Set up POST /connections route with request validation and controller method for creating a new connection
  router.post(
    '/connections',
    connectionRateLimiter,
    validateRequest(connectionSchema.create),
    connectionController.createConnection
  );

  // Set up DELETE /connections/:id route with controller method for removing a connection
  router.delete(
    '/connections/:id',
    connectionRateLimiter,
    connectionController.removeConnection
  );

  // Set up GET /connections/suggestions route with controller method for getting connection suggestions
  router.get(
    '/connections/suggestions',
    connectionRateLimiter,
    connectionController.getConnectionSuggestions
  );

  // Set up GET /connections/mutual/:userId route with controller method for getting mutual connections
  router.get(
    '/connections/mutual/:userId',
    connectionRateLimiter,
    connectionController.getMutualConnections
  );

  // Return the configured router
  return router;
};

export const router = createConnectionRouter();