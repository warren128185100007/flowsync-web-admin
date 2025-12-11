// src/types/admin.types.ts
import { Timestamp } from 'firebase/firestore';

export interface SuperAdmin {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  isLocked: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string | null;
  loginAttempts: number;
  maxLoginAttempts: number;
  lastLoginAt?: Date | Timestamp | null;
  lastLoginIp?: string | null;
  passwordChangedAt?: Date | Timestamp | null;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  permissions: string[];
}

export interface AdminLoginData {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  admin?: SuperAdmin;
  requiresMFA?: boolean;
}