import { Router } from 'express';
import { PostController } from 'src/backend/controllers/PostController';
import { validateRequest } from 'src/backend/middleware/validateRequest';
import { postSchema } from 'src/backend/schemas/postSchema';
import { authMiddleware } from 'src/backend/middleware/auth';
import { rateLimiter } from 'src/backend/middleware/rateLimiter';

const createPostRouter = (): Router => {
  const router = Router();
  const postController = new PostController();

  // Define rate limiter for post routes
  const postRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 });

  // Apply authMiddleware to all routes to ensure authentication
  router.use(authMiddleware);

  // POST /posts - Create a new post
  router.post(
    '/',
    postRateLimiter,
    validateRequest(postSchema.create),
    postController.createPost
  );

  // GET /posts - Retrieve posts (with optional filtering)
  router.get('/', postRateLimiter, postController.getPosts);

  // GET /posts/:id - Retrieve a specific post
  router.get('/:id', postRateLimiter, postController.getPost);

  // PUT /posts/:id - Update a post
  router.put(
    '/:id',
    postRateLimiter,
    validateRequest(postSchema.update),
    postController.updatePost
  );

  // DELETE /posts/:id - Delete a post
  router.delete('/:id', postRateLimiter, postController.deletePost);

  // POST /posts/:id/like - Like a post
  router.post('/:id/like', postRateLimiter, postController.likePost);

  // POST /posts/:id/unlike - Unlike a post
  router.post('/:id/unlike', postRateLimiter, postController.unlikePost);

  // POST /posts/:id/comment - Add a comment to a post
  router.post(
    '/:id/comment',
    postRateLimiter,
    validateRequest(postSchema.comment),
    postController.addComment
  );

  // DELETE /posts/:id/comment/:commentId - Delete a comment
  router.delete('/:id/comment/:commentId', postRateLimiter, postController.deleteComment);

  // GET /posts/:id/comments - Retrieve comments on a post
  router.get('/:id/comments', postRateLimiter, postController.getComments);

  return router;
};

export const router = createPostRouter();