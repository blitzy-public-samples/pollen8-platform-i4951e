import { Request, Response, NextFunction } from 'express';
import { PostService } from 'src/backend/services/PostService';
import { HttpException } from 'src/backend/utils/HttpException';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming user is attached to request by auth middleware
      const { content, industryNetworkId } = req.body;

      // TODO: Implement input validation for content and industryNetworkId

      const newPost = await this.postService.createPost(userId, content, industryNetworkId);
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }

  public getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.params.id;
      const post = await this.postService.getPost(postId);

      if (!post) {
        throw new HttpException(404, 'Post not found');
      }

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  public updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const { content } = req.body;

      // TODO: Implement input validation for content

      const updatedPost = await this.postService.updatePost(postId, userId, content);

      if (!updatedPost) {
        throw new HttpException(404, 'Post not found or user not authorized');
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  public deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;

      const result = await this.postService.deletePost(postId, userId);

      if (!result) {
        throw new HttpException(404, 'Post not found or user not authorized');
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public getPostsForIndustryNetwork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const industryNetworkId = req.params.industryNetworkId;
      const { page = 1, limit = 10 } = req.query;

      // TODO: Implement input validation for pagination options

      const posts = await this.postService.getPostsForIndustryNetwork(
        industryNetworkId,
        { page: Number(page), limit: Number(limit) }
      );

      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}

// TODO: Implement rate limiting middleware
// TODO: Add logging for all post-related actions
// TODO: Implement caching mechanisms for frequently accessed posts