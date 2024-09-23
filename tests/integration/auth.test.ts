import request from 'supertest';
import { app } from '../../src/backend/app';
import { AuthService } from '../../src/backend/services/AuthService';
import { User } from '../../src/backend/models/User';
import { sequelize } from '../../src/backend/config/database';
import { redisClient } from '../../src/backend/config/redis';
import twilio from 'twilio';

jest.mock('twilio');

describe('Authentication Integration Tests', () => {
  let authService: AuthService;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    authService = new AuthService();
  });

  afterAll(async () => {
    await sequelize.close();
    await redisClient.quit();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  const mockTwilioVerify = {
    services: jest.fn().mockReturnThis(),
    verifications: jest.fn().mockReturnThis(),
    create: jest.fn(),
    verificationChecks: jest.fn().mockReturnThis(),
  };

  (twilio as jest.Mock).mockReturnValue({
    verify: {
      v2: {
        services: mockTwilioVerify.services,
      },
    },
  });

  describe('Phone number verification', () => {
    it('should send OTP to a valid phone number', async () => {
      mockTwilioVerify.create.mockResolvedValueOnce({ status: 'pending' });

      const response = await request(app)
        .post('/api/auth/verify')
        .send({ phoneNumber: '+1234567890' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Verification code sent');
    });

    it('should return an error for invalid phone number', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({ phoneNumber: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('OTP validation', () => {
    it('should validate correct OTP', async () => {
      mockTwilioVerify.verificationChecks.create.mockResolvedValueOnce({ status: 'approved' });

      const response = await request(app)
        .post('/api/auth/validate')
        .send({ phoneNumber: '+1234567890', otp: '123456' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'OTP validated successfully');
    });

    it('should reject incorrect OTP', async () => {
      mockTwilioVerify.verificationChecks.create.mockResolvedValueOnce({ status: 'denied' });

      const response = await request(app)
        .post('/api/auth/validate')
        .send({ phoneNumber: '+1234567890', otp: '000000' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid OTP');
    });
  });

  describe('User registration', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '+1234567890',
          username: 'testuser',
          location: 'Test City',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should not register a user with existing phone number', async () => {
      await User.create({
        phoneNumber: '+1234567890',
        username: 'existinguser',
        location: 'Existing City',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '+1234567890',
          username: 'testuser',
          location: 'Test City',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('User login', () => {
    it('should login an existing user', async () => {
      await User.create({
        phoneNumber: '+1234567890',
        username: 'testuser',
        location: 'Test City',
      });

      mockTwilioVerify.verificationChecks.create.mockResolvedValueOnce({ status: 'approved' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '+1234567890', otp: '123456' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should not login with incorrect OTP', async () => {
      await User.create({
        phoneNumber: '+1234567890',
        username: 'testuser',
        location: 'Test City',
      });

      mockTwilioVerify.verificationChecks.create.mockResolvedValueOnce({ status: 'denied' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '+1234567890', otp: '000000' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('Protected route access', () => {
    it('should access protected route with valid token', async () => {
      const user = await User.create({
        phoneNumber: '+1234567890',
        username: 'testuser',
        location: 'Test City',
      });

      const token = authService.generateToken(user);

      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Access granted');
    });

    it('should not access protected route without token', async () => {
      const response = await request(app).get('/api/protected');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });
  });
});