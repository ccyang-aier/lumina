/**
 * Auth Store
 * Zustand store for authentication state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserLogin, UserRegister } from '@/lib/api/types/auth'
import { authService } from '@/services/auth'
import { apiClient } from '@/lib/api/client'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (data: UserLogin) => Promise<void>
  register: (data: UserRegister) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  clearError: () => void
  checkAuth: () => Promise<void>
  refreshAccessToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: UserLogin) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(data)
          apiClient.setToken(response.access_token)
          set({
            user: response.user,
            token: response.access_token,
            refreshToken: response.refresh_token || null,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      register: async (data: UserRegister) => {
        set({ isLoading: true, error: null })
        try {
          await authService.register(data)
          // Auto login after registration
          await get().login({ email: data.email, password: data.password })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch {
          // Ignore logout errors
        }
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setToken: (token) => {
        apiClient.setToken(token)
        set({ token, isAuthenticated: !!token })
      },

      clearError: () => {
        set({ error: null })
      },

      checkAuth: async () => {
        const token = get().token || apiClient.getToken()
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }
        
        set({ isLoading: true })
        try {
          // Verify token by fetching current user
          const user = await authService.getCurrentUser()
          apiClient.setToken(token)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            token,
          })
        } catch {
          // Token invalid, try refresh
          const refreshToken = get().refreshToken
          if (refreshToken) {
            const success = await get().refreshAccessToken()
            if (!success) {
              set({ isAuthenticated: false, user: null, token: null, refreshToken: null, isLoading: false })
            }
          } else {
            set({ isAuthenticated: false, user: null, token: null, isLoading: false })
          }
        }
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken
        if (!refreshToken) {
          return false
        }
        
        try {
          const response = await authService.refreshToken(refreshToken)
          apiClient.setToken(response.access_token)
          set({
            token: response.access_token,
            refreshToken: response.refresh_token || refreshToken,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
