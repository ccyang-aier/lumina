/**
 * Auth Service
 * API service for authentication operations
 */

import { apiClient } from '@/lib/api/client'
import type {
  User,
  UserRegister,
  UserLogin,
  UserUpdate,
  TokenResponse,
  LoginApiResponse,
  UserApiResponse,
} from '@/lib/api/types/auth'

const AUTH_BASE_PATH = '/auth'

export const authService = {
  /**
   * Register a new user
   */
  async register(data: UserRegister): Promise<User> {
    const response = await apiClient.post<UserApiResponse>(`${AUTH_BASE_PATH}/register`, data)
    return response
  },

  /**
   * Login user
   */
  async login(data: UserLogin): Promise<TokenResponse> {
    const response = await apiClient.post<LoginApiResponse>(`${AUTH_BASE_PATH}/login`, data)
    // Store token in API client
    apiClient.setToken(response.access_token)
    return response
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await apiClient.post(`${AUTH_BASE_PATH}/logout`)
    } catch {
      // Ignore logout API errors
    } finally {
      // Always clear token from client
      apiClient.setToken(null)
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<LoginApiResponse>(`${AUTH_BASE_PATH}/refresh`, {
      refresh_token: refreshToken,
    })
    // Store new token in API client
    apiClient.setToken(response.access_token)
    return response
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<UserApiResponse>(`${AUTH_BASE_PATH}/me`)
    return response
  },

  /**
   * Update current user
   */
  async updateCurrentUser(data: UserUpdate): Promise<User> {
    const response = await apiClient.put<UserApiResponse>(`${AUTH_BASE_PATH}/me`, data)
    return response
  },

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User> {
    const response = await apiClient.get<UserApiResponse>(`${AUTH_BASE_PATH}/users/${userId}`)
    return response
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiClient.getToken()
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return apiClient.getToken()
  },
}

export default authService
