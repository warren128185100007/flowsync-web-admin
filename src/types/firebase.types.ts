export interface AdminCreationResult {
  success: boolean;
  email?: string;
  password?: string;
  userId?: string;
  usersCollection?: string;
  error?: string;
  code?: string;
}

export interface MobileAppUser {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  [key: string]: any;
}