import { Router } from 'express';
import { InterestController } from 'src/backend/controllers/InterestController';
import { validateRequest } from 'src/backend/middleware/validateRequest';
import { interestSchema } from 'src/backend/schemas/interestSchema';
import { authMiddleware } from 'src/backend/middleware/auth';
import { rateLimiter } from 'src/backend/middleware/rateLimiter';

const router = Router();
const interestController = new InterestController();

// Define rate limiter for interest routes
const interestRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

// Apply authMiddleware to all routes to ensure authentication
router.use(authMiddleware);

// GET /interests - Retrieve all interests
router.get('/', interestRateLimiter, interestController.getAllInterests);

// GET /interests/:id - Retrieve a specific interest
router.get('/:id', interestRateLimiter, interestController.getInterestById);

// POST /interests - Create a new interest
router.post('/', interestRateLimiter, validateRequest(interestSchema.create), interestController.createInterest);

// PUT /interests/:id - Update an interest
router.put('/:id', interestRateLimiter, validateRequest(interestSchema.update), interestController.updateInterest);

// DELETE /interests/:id - Delete an interest
router.delete('/:id', interestRateLimiter, interestController.deleteInterest);

// GET /interests/user - Retrieve user's interests
router.get('/user', interestRateLimiter, interestController.getUserInterests);

// POST /interests/user - Add an interest to a user
router.post('/user', interestRateLimiter, validateRequest(interestSchema.addToUser), interestController.addInterestToUser);

// DELETE /interests/user/:id - Remove an interest from a user
router.delete('/user/:id', interestRateLimiter, interestController.removeInterestFromUser);

export { router as interestRouter };