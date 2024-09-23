import { Router } from 'express';
import { InviteController } from 'src/backend/controllers/InviteController';
import { validateRequest } from 'src/backend/middleware/validateRequest';
import { inviteSchema } from 'src/backend/schemas/inviteSchema';
import { authMiddleware } from 'src/backend/middleware/auth';
import { rateLimiter } from 'src/backend/middleware/rateLimiter';

const router = Router();
const inviteController = new InviteController();

// Define rate limiter for invite routes
const inviteRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

// Apply authMiddleware to all routes to ensure authentication
router.use(authMiddleware);

// Create a new invite
router.post(
  '/invites',
  inviteRateLimiter,
  validateRequest(inviteSchema.create),
  inviteController.createInvite
);

// Get user's invites
router.get('/invites', inviteRateLimiter, inviteController.getUserInvites);

// Delete an invite
router.delete('/invites/:id', inviteRateLimiter, inviteController.deleteInvite);

// Get invite statistics
router.get('/invites/:id/stats', inviteRateLimiter, inviteController.getInviteStats);

// Track invite clicks
router.post(
  '/invites/track',
  inviteRateLimiter,
  validateRequest(inviteSchema.track),
  inviteController.trackInviteClick
);

export { router as inviteRouter };