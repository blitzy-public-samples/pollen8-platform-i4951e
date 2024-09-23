import { Request, Response, NextFunction } from 'express';
import { InviteService } from 'src/backend/services/InviteService.ts';
import { HttpException } from 'src/backend/utils/HttpException.ts';

export class InviteController {
  private inviteService: InviteService;

  constructor() {
    this.inviteService = new InviteService();
  }

  public createInvite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming user is attached to request by auth middleware
      const { linkName } = req.body;

      // TODO: Implement input validation for linkName

      const newInvite = await this.inviteService.createInvite(userId, linkName);
      res.status(201).json(newInvite);
    } catch (error) {
      next(error);
    }
  }

  public getUserInvites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      // TODO: Implement pagination
      const invites = await this.inviteService.getUserInvites(userId);
      res.status(200).json(invites);
    } catch (error) {
      next(error);
    }
  }

  public deleteInvite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const inviteId = req.params.id;

      // TODO: Implement authorization check to ensure user owns the invite
      await this.inviteService.deleteInvite(inviteId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public getInviteStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inviteId = req.params.id;
      const stats = await this.inviteService.getInviteStats(inviteId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public trackInviteClick = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { linkUrl } = req.body;

      // TODO: Implement input validation for linkUrl
      await this.inviteService.trackInviteClick(linkUrl);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

// TODO: Implement rate limiting middleware
// TODO: Implement logging middleware
// TODO: Add unit tests for all methods
// TODO: Implement invite expiration functionality