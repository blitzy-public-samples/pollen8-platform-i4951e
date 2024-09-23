import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/backend/services/UserService';
import { NetworkService } from 'src/backend/services/NetworkService';
import { HttpException } from 'src/backend/utils/HttpException';

export class UserController {
  private userService: UserService;
  private networkService: NetworkService;

  constructor() {
    this.userService = new UserService();
    this.networkService = new NetworkService();
  }

  public getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId || (req.user as any).id;
      const userProfile = await this.userService.getUserProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  }

  public updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any).id;
      const updateData = req.body;
      // TODO: Implement input validation for updateData
      const updatedProfile = await this.userService.updateUserProfile(userId, updateData);
      res.status(200).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  public getUserConnections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId || (req.user as any).id;
      // TODO: Implement pagination
      const connections = await this.userService.getUserConnections(userId);
      res.status(200).json(connections);
    } catch (error) {
      next(error);
    }
  }

  public addUserConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any).id;
      const { connectedUserId } = req.body;
      // TODO: Implement input validation for connectedUserId
      const newConnection = await this.userService.addUserConnection(userId, connectedUserId);
      res.status(201).json(newConnection);
    } catch (error) {
      next(error);
    }
  }

  public getNetworkValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId || (req.user as any).id;
      const networkValue = await this.networkService.calculateNetworkValue(userId);
      res.status(200).json(networkValue);
    } catch (error) {
      next(error);
    }
  }
}