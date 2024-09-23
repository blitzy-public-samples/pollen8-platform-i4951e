import { UserController } from 'src/backend/controllers/UserController';
import { UserService } from 'src/backend/services/UserService';
import { NetworkService } from 'src/backend/services/NetworkService';
import { HttpException } from 'src/backend/utils/HttpException';
import { Request, Response, NextFunction } from 'express';
import { mockRequest, mockResponse } from 'jest-mock-req-res';

jest.mock('src/backend/services/UserService');
jest.mock('src/backend/services/NetworkService');

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockNetworkService: jest.Mocked<NetworkService>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    mockNetworkService = new NetworkService() as jest.Mocked<NetworkService>;
    userController = new UserController(mockUserService, mockNetworkService);
  });

  describe('getUserProfile', () => {
    it('should return user profile when valid userId is provided', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      mockUserService.getUserProfile.mockResolvedValue(mockUser);

      const req = mockRequest({ params: { userId: '1' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.getUserProfile(req as Request, res as Response, next);

      expect(mockUserService.getUserProfile).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should call next with HttpException when user is not found', async () => {
      mockUserService.getUserProfile.mockRejectedValue(new Error('User not found'));

      const req = mockRequest({ params: { userId: 'nonexistent' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.getUserProfile(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpException));
    });
  });

  describe('updateUserProfile', () => {
    it('should update and return user profile when valid data is provided', async () => {
      const mockUpdatedUser = { id: '1', username: 'updateduser' };
      mockUserService.updateUserProfile.mockResolvedValue(mockUpdatedUser);

      const req = mockRequest({ params: { userId: '1' }, body: { username: 'updateduser' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.updateUserProfile(req as Request, res as Response, next);

      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith('1', { username: 'updateduser' });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should call next with HttpException when update fails', async () => {
      mockUserService.updateUserProfile.mockRejectedValue(new Error('Update failed'));

      const req = mockRequest({ params: { userId: '1' }, body: { username: 'invaliduser' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.updateUserProfile(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpException));
    });
  });

  describe('getUserConnections', () => {
    it('should return user connections when valid userId is provided', async () => {
      const mockConnections = [{ id: '2', username: 'connection1' }, { id: '3', username: 'connection2' }];
      mockUserService.getUserConnections.mockResolvedValue(mockConnections);

      const req = mockRequest({ params: { userId: '1' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.getUserConnections(req as Request, res as Response, next);

      expect(mockUserService.getUserConnections).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockConnections);
    });

    it('should call next with HttpException when fetching connections fails', async () => {
      mockUserService.getUserConnections.mockRejectedValue(new Error('Failed to fetch connections'));

      const req = mockRequest({ params: { userId: '1' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.getUserConnections(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpException));
    });
  });

  describe('addUserConnection', () => {
    it('should add and return new connection when valid data is provided', async () => {
      const mockNewConnection = { id: '2', username: 'newconnection' };
      mockUserService.addUserConnection.mockResolvedValue(mockNewConnection);

      const req = mockRequest({ params: { userId: '1' }, body: { connectedUserId: '2' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.addUserConnection(req as Request, res as Response, next);

      expect(mockUserService.addUserConnection).toHaveBeenCalledWith('1', '2');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewConnection);
    });

    it('should call next with HttpException when adding connection fails', async () => {
      mockUserService.addUserConnection.mockRejectedValue(new Error('Failed to add connection'));

      const req = mockRequest({ params: { userId: '1' }, body: { connectedUserId: 'invalid' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.addUserConnection(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpException));
    });
  });

  describe('getNetworkValue', () => {
    it('should return network value when valid userId is provided', async () => {
      const mockNetworkValue = { value: 100 };
      mockNetworkService.calculateNetworkValue.mockResolvedValue(mockNetworkValue);

      const req = mockRequest({ params: { userId: '1' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.getNetworkValue(req as Request, res as Response, next);

      expect(mockNetworkService.calculateNetworkValue).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockNetworkValue);
    });

    it('should call next with HttpException when calculating network value fails', async () => {
      mockNetworkService.calculateNetworkValue.mockRejectedValue(new Error('Failed to calculate network value'));

      const req = mockRequest({ params: { userId: '1' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await userController.getNetworkValue(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpException));
    });
  });
});