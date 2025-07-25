import { Types } from 'mongoose';

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  url: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  age?: number;
  role?: 'user' | 'admin';
  isActive?: boolean;
  refreshToken?: string | null;
  socials?: SocialLink[];
  projects?: IProject[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Omit<IUser, 'password'>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: Omit<IUser, 'password'>;
    token: string;
  };
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  location: string;
  isActive?: boolean;
  createdBy: Types.ObjectId | string;
  updatedBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventDocument extends IEvent {
  // Méthodes spécifiques à l'événement si nécessaire
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  externalUrl?: string;
  createdBy: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocument extends IProject {
  // Méthodes spécifiques au projet si besoin
}

// --- Ajout des entités principales ---