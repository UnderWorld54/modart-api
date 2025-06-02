import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: RegisterRequest = req.body;
      
      // Validation basique
      if (!userData.name || !userData.email || !userData.password) {
        const response: AuthResponse = {
          success: false,
          error: 'Name, email and password are required'
        };
        res.status(400).json(response);
        return;
      }

      if (userData.password.length < 6) {
        const response: AuthResponse = {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
        res.status(400).json(response);
        return;
      }

      const { user, token } = await this.authService.register(userData);
      
      const response: AuthResponse = {
        success: true,
        data: {
          user: user.toJSON(),
          token
        },
        message: 'User registered successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      const response: AuthResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
      res.status(400).json(response);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginRequest = req.body;
      
      if (!credentials.email || !credentials.password) {
        const response: AuthResponse = {
          success: false,
          error: 'Email and password are required'
        };
        res.status(400).json(response);
        return;
      }

      const { user, token } = await this.authService.login(credentials);
      
      const response: AuthResponse = {
        success: true,
        data: {
          user: user.toJSON(),
          token
        },
        message: 'Login successful'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: AuthResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
      res.status(401).json(response);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        const response: AuthResponse = {
          success: false,
          error: 'User not authenticated'
        };
        res.status(401).json(response);
        return;
      }

      const user = await this.authService.getUserById(userId.toString());
      
      if (!user) {
        const response: AuthResponse = {
          success: false,
          error: 'User not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: AuthResponse = {
        success: true,
        data: {
          user: user.toJSON(),
          token: '' // On ne renvoie pas le token pour le profil
        },
        message: 'Profile retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: AuthResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile'
      };
      res.status(500).json(response);
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;
      const { currentPassword, newPassword } = req.body;
      
      if (!userId) {
        const response: AuthResponse = {
          success: false,
          error: 'User not authenticated'
        };
        res.status(401).json(response);
        return;
      }

      if (!currentPassword || !newPassword) {
        const response: AuthResponse = {
          success: false,
          error: 'Current password and new password are required'
        };
        res.status(400).json(response);
        return;
      }

      if (newPassword.length < 6) {
        const response: AuthResponse = {
          success: false,
          error: 'New password must be at least 6 characters long'
        };
        res.status(400).json(response);
        return;
      }

      await this.authService.changePassword(userId.toString(), currentPassword, newPassword);
      
      const response: AuthResponse = {
        success: true,
        message: 'Password changed successfully'
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: AuthResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Password change failed'
      };
      res.status(400).json(response);
    }
  };
}