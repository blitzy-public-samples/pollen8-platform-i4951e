import { Request, Response, NextFunction } from 'express';
import { NetworkService } from 'src/backend/services/NetworkService.ts';
import { HttpException } from 'src/backend/utils/HttpException.ts';

export class NetworkController {
  private networkService: NetworkService;

  constructor() {
    this.networkService = new NetworkService();
  }

  public createIndustryNetwork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { industryId, name } = req.body;

      // TODO: Implement input validation for industryId and name

      const newIndustryNetwork = await this.networkService.createIndustryNetwork(industryId, name);
      res.status(201).json(newIndustryNetwork);
    } catch (error) {
      next(error);
    }
  }

  public getIndustryNetworks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement pagination
      const industryNetworks = await this.networkService.getIndustryNetworks();
      res.status(200).json(industryNetworks);
    } catch (error) {
      next(error);
    }
  }

  public joinIndustryNetwork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming user is attached to request by auth middleware
      const { networkId } = req.body;

      // TODO: Implement input validation for networkId

      await this.networkService.joinIndustryNetwork(userId, networkId);
      res.status(200).json({ message: 'Successfully joined the industry network' });
    } catch (error) {
      next(error);
    }
  }

  public calculateNetworkValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming user is attached to request by auth middleware
      const networkValue = await this.networkService.calculateNetworkValue(userId);
      res.status(200).json({ networkValue });
    } catch (error) {
      next(error);
    }
  }

  public getNetworkFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming user is attached to request by auth middleware
      const { page = 1, limit = 10, ...filters } = req.query; // Extract pagination and filtering options

      // TODO: Implement input validation for pagination and filtering options

      const networkFeed = await this.networkService.getNetworkFeed(userId, { page: Number(page), limit: Number(limit), ...filters });
      res.status(200).json(networkFeed);
    } catch (error) {
      next(error);
    }
  }
}