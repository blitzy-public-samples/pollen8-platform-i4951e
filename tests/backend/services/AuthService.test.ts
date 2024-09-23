import { AuthService } from 'src/backend/services/AuthService';
import { User } from 'src/backend/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import twilio from 'twilio';
import { JWT_SECRET } from 'src/backend/config/constants';

// Mock dependencies
jest.mock('twilio');
jest.mock('src/backend/models/User');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  const mockTwilioClient = {
    verify: {
      services: jest.fn().mockReturnThis(),
      verifications: {
        create: jest.fn(),
      },
      verificationChecks: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (twilio as jest.Mock).mockReturnValue(mockTwilioClient);
    authService = new AuthService();
  });

  describe('sendVerificationCode', () => {
    it('should send a verification code successfully', async () => {
      const phoneNumber = '+1234567890';
      mockTwilioClient.verify.services().verifications.create.mockResolvedValue({ sid: 'test_sid' });

      const result = await authService.sendVerificationCode(phoneNumber);

      expect(result).toBe(true);
      expect(mockTwilioClient.verify.services().verifications.create).toHaveBeenCalledWith({
        to: phoneNumber,
        channel: 'sms',
      });
    });

    it('should return false if sending verification code fails', async () => {
      const phoneNumber = '+1234567890';
      mockTwilioClient.verify.services().verifications.create.mockRejectedValue(new Error('Failed to send'));

      const result = await authService.sendVerificationCode(phoneNumber);

      expect(result).toBe(false);
    });
  });

  describe('verifyCode', () => {
    it('should verify the code successfully', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      mockTwilioClient.verify.services().verificationChecks.create.mockResolvedValue({ status: 'approved' });

      const result = await authService.verifyCode(phoneNumber, code);

      expect(result).toBe(true);
      expect(mockTwilioClient.verify.services().verificationChecks.create).toHaveBeenCalledWith({
        to: phoneNumber,
        code,
      });
    });

    it('should return false if verification fails', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      mockTwilioClient.verify.services().verificationChecks.create.mockResolvedValue({ status: 'denied' });

      const result = await authService.verifyCode(phoneNumber, code);

      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should login successfully and return user with token', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      const mockUser = { id: '1', phoneNumber };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');
      mockTwilioClient.verify.services().verificationChecks.create.mockResolvedValue({ status: 'approved' });

      const result = await authService.login(phoneNumber, code);

      expect(result).toEqual({ user: mockUser, token: 'mock_token' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, JWT_SECRET, { expiresIn: '1h' });
    });

    it('should return null if verification fails', async () => {
      const phoneNumber = '+1234567890';
      const code = '123456';
      mockTwilioClient.verify.services().verificationChecks.create.mockResolvedValue({ status: 'denied' });

      const result = await authService.login(phoneNumber, code);

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = { phoneNumber: '+1234567890', username: 'testuser' };
      const mockUser = { id: '1', ...userData };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result).toEqual(mockUser);
      expect(User.create).toHaveBeenCalledWith(userData);
    });

    it('should throw an error if user already exists', async () => {
      const userData = { phoneNumber: '+1234567890', username: 'testuser' };
      (User.findOne as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(authService.register(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return user', async () => {
      const token = 'valid_token';
      const decodedToken = { userId: '1' };
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.verifyToken(token);

      expect(result).toEqual(mockUser);
      expect(jwt.verify).toHaveBeenCalledWith(token, JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(decodedToken.userId);
    });

    it('should return null for an invalid token', async () => {
      const token = 'invalid_token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await authService.verifyToken(token);

      expect(result).toBeNull();
    });
  });
});