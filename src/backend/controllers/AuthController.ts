import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/backend/services/AuthService';
import { UserService } from 'src/backend/services/UserService';
import { HttpException } from 'src/backend/utils/HttpException';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  public sendVerificationCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phoneNumber } = req.body;

      // TODO: Implement phone number format validation

      const result = await this.authService.sendVerificationCode(phoneNumber);
      if (result) {
        res.status(200).json({ message: 'Verification code sent successfully' });
      } else {
        throw new HttpException(500, 'Failed to send verification code');
      }
    } catch (error) {
      next(error);
    }
  }

  public verifyCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phoneNumber, code } = req.body;

      // TODO: Implement phone number and code format validation

      const isValid = await this.authService.verifyCode(phoneNumber, code);
      if (isValid) {
        const token = await this.authService.generateToken(phoneNumber);
        const user = await this.userService.getUserByPhoneNumber(phoneNumber);
        res.status(200).json({ token, user });
      } else {
        throw new HttpException(400, 'Invalid verification code');
      }
    } catch (error) {
      next(error);
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phoneNumber, code } = req.body;
      const result = await this.authService.login(phoneNumber, code);
      if (result) {
        res.status(200).json(result);
      } else {
        throw new HttpException(401, 'Invalid credentials');
      }
    } catch (error) {
      next(error);
    }
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;

      // TODO: Implement registration data validation

      const newUser = await this.userService.register(userData);
      if (newUser) {
        const token = await this.authService.generateToken(newUser.phoneNumber);
        res.status(201).json({ token, user: newUser });
      } else {
        throw new HttpException(500, 'Failed to register user');
      }
    } catch (error) {
      next(error);
    }
  }
}