import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import twilio from 'twilio';
import { JWT_SECRET, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } from '../config/constants';

export class AuthService {
  private twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  async sendVerificationCode(phoneNumber: string): Promise<boolean> {
    try {
      const verification = await this.twilioClient.verify.services(TWILIO_VERIFY_SERVICE_SID)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });
      return verification.status === 'pending';
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const verificationCheck = await this.twilioClient.verify.services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: phoneNumber, code });
      return verificationCheck.status === 'approved';
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }

  async login(phoneNumber: string, code: string): Promise<{ user: User; token: string } | null> {
    const isCodeValid = await this.verifyCode(phoneNumber, code);
    if (!isCodeValid) {
      return null;
    }

    let user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      user = await User.create({ phoneNumber });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    return { user, token };
  }

  async register(userData: Partial<User>): Promise<User> {
    const existingUser = await User.findOne({ where: { phoneNumber: userData.phoneNumber } });
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    const newUser = await User.create(userData);
    return newUser;
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await User.findByPk(decoded.userId);
      return user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
}