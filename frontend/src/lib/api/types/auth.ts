/**
 * Auth Types
 * Type definitions for the authentication module
 */

// User role enum
export type UserRole = 'admin' | 'user' | 'guest'

// User status enum
export type UserStatus = 'active' | 'inactive' | 'suspended'

// Full user data
export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  bio?: string
  avatar?: string
  guild?: string
  role: UserRole
  is_active: boolean
  knowledge_count: number
  comment_count: number
  likes_received: number
  created_at: string
  updated_at: string
}

// Brief user info for nested display
export interface UserBrief {
  name: string
  avatar?: string
  guild?: string
  bio?: string
  role?: string
}

// User registration payload
export interface UserRegister {
  email: string
  username: string
  password: string
  full_name?: string
  bio?: string
  guild?: string
}

// User login payload
export interface UserLogin {
  email: string
  password: string
}

// User update payload
export interface UserUpdate {
  email?: string
  full_name?: string
  bio?: string
  avatar?: string
  guild?: string
  password?: string
}

// Token response
export interface TokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
  user: User
}

// Auth state
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// API Response wrappers
export interface LoginApiResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
  user: User
}

export interface UserApiResponse {
  id: string
  email: string
  username: string
  full_name?: string
  bio?: string
  avatar?: string
  guild?: string
  role: UserRole
  is_active: boolean
  knowledge_count: number
  comment_count: number
  likes_received: number
  created_at: string
  updated_at: string
}
