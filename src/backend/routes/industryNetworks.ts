import { Router } from 'express';
import { IndustryNetworkController } from 'src/backend/controllers/IndustryNetworkController.ts';
import { validateRequest } from 'src/backend/middleware/validateRequest.ts';
import { industryNetworkSchema } from 'src/backend/schemas/industryNetworkSchema.ts';
import { authMiddleware } from 'src/backend/middleware/auth.ts';
import { rateLimiter } from 'src/backend/middleware/rateLimiter.ts';

const router = Router();
const industryNetworkController = new IndustryNetworkController();

// Apply rate limiter to all routes
const industryNetworkRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(industryNetworkRateLimiter);

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /industry-networks - Retrieve all industry networks
router.get('/', industryNetworkController.getAllIndustryNetworks);

// GET /industry-networks/:id - Retrieve a specific industry network
router.get('/:id', industryNetworkController.getIndustryNetwork);

// POST /industry-networks - Create a new industry network
router.post('/', validateRequest(industryNetworkSchema.create), industryNetworkController.createIndustryNetwork);

// PUT /industry-networks/:id - Update an industry network
router.put('/:id', validateRequest(industryNetworkSchema.update), industryNetworkController.updateIndustryNetwork);

// DELETE /industry-networks/:id - Delete an industry network
router.delete('/:id', industryNetworkController.deleteIndustryNetwork);

// POST /industry-networks/:id/join - Join an industry network
router.post('/:id/join', industryNetworkController.joinIndustryNetwork);

// POST /industry-networks/:id/leave - Leave an industry network
router.post('/:id/leave', industryNetworkController.leaveIndustryNetwork);

// GET /industry-networks/:id/members - Retrieve members of an industry network
router.get('/:id/members', industryNetworkController.getIndustryNetworkMembers);

// GET /industry-networks/:id/posts - Retrieve posts in an industry network
router.get('/:id/posts', industryNetworkController.getIndustryNetworkPosts);

export { router as industryNetworkRouter };