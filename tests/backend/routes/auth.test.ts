import request from 'supertest';
import { app } from 'src/backend/app';
import { AuthService } from 'src/backend/services/AuthService';
import { User } from 'src/backend/models/User';
import { sequelize } from 'src/backend/config/database';

jest.mock('src/backend/services/AuthService');

describe('Auth Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/verify', () => {
    it('should send verification code successfully', async () => {
      const mockSendVerificationCode = jest.spyOn(AuthService.prototype, 'sendVerificationCode')
        .mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/verify')
        .send({ phoneNumber: '+1234567890' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Verification code sent successfully' });
      expect(mockSendVerificationCode).toHaveBeenCalledWith('+1234567890');
    });

    it('should return 400 for invalid phone number', async () => {
      const response = await request(app)
        .post('/auth/verify')
        .send({ phoneNumber: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const mockToken = 'mock-token';
      const mockLogin = jest.spyOn(AuthService.prototype, 'login')
        .mockResolvedValue({ user: mockUser, token: mockToken });

      const response = await request(app)
        .post('/auth/login')
        .send({ phoneNumber: '+1234567890', code: '123456' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, token: mockToken });
      expect(mockLogin).toHaveBeenCalledWith('+1234567890', '123456');
    });

    it('should return 401 for invalid credentials', async () => {
      jest.spyOn(AuthService.prototype, 'login').mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({ phoneNumber: '+1234567890', code: 'invalid' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { id: '1', phoneNumber: '+1234567890', username: 'testuser' };
      const mockRegister = jest.spyOn(AuthService.prototype, 'register')
        .mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send({ phoneNumber: '+1234567890', username: 'testuser' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(mockRegister).toHaveBeenCalledWith({ phoneNumber: '+1234567890', username: 'testuser' });
    });

    it('should return 400 for invalid registration data', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ phoneNumber: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});