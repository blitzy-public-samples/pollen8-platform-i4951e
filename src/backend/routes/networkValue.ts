import { Router } from 'express';
import { NetworkValueController } from 'src/backend/controllers/NetworkValueController.ts';
import { authMiddleware } from 'src/backend/middleware/auth.ts';
import { rateLimiter } from 'src/backend/middleware/rateLimiter.ts';

const createNetworkValueRouter = (): Router => {
  // Create a new Express Router instance
  const router = Router();

  // Create an instance of NetworkValueController
  const networkValueController = new NetworkValueController();

  // Define rate limiter for network value routes
  const networkValueRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

  // Apply authMiddleware to all routes to ensure authentication
  router.use(authMiddleware);

  // Set up GET /network-value route with controller method for retrieving user's network value
  router.get(
    '/network-value',
    networkValueRateLimiter,
    networkValueController.getUserNetworkValue
  );

  // Set up GET /network-value/history route with controller method for retrieving user's network value history
  router.get(
    '/network-value/history',
    networkValueRateLimiter,
    networkValueController.getUserNetworkValueHistory
  );

  // Set up GET /network-value/top route with controller method for retrieving top network values
  router.get(
    '/network-value/top',
    networkValueRateLimiter,
    networkValueController.getTopNetworkValues
  );

  // Return the configured router
  return router;
};

export const router = createNetworkValueRouter();