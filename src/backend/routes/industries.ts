import { Router } from 'express';
import { IndustryController } from 'src/backend/controllers/IndustryController';
import { validateRequest } from 'src/backend/middleware/validateRequest';
import { industrySchema } from 'src/backend/schemas/industrySchema';
import { authMiddleware } from 'src/backend/middleware/auth';
import { rateLimiter } from 'src/backend/middleware/rateLimiter';

const router = Router();
const industryController = new IndustryController();

// Apply rate limiter to all routes
const industryRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(industryRateLimiter);

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /industries - Retrieve all industries
router.get('/', industryController.getAllIndustries);

// GET /industries/:id - Retrieve a specific industry
router.get('/:id', industryController.getIndustryById);

// POST /industries - Create a new industry
router.post(
  '/',
  validateRequest(industrySchema.create),
  industryController.createIndustry
);

// PUT /industries/:id - Update an industry
router.put(
  '/:id',
  validateRequest(industrySchema.update),
  industryController.updateIndustry
);

// DELETE /industries/:id - Delete an industry
router.delete('/:id', industryController.deleteIndustry);

export { router as industryRouter };