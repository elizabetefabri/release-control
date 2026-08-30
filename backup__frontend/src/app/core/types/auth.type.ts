export type UserRole = 'guest' | 'dev' | 'rm';
export type UserStatus = 'pending' | 'active' | 'blocked';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: UserRole;
  status?: UserStatus;
  provider?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatarUrl?: string;
}

export interface ProfileDto {
  name: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  blocked: number;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  target?: string;
  ip?: string;
  createdAt: string;
}
