/**
 * Lumina API Client
 * Central HTTP client for all backend API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Initialize token from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...init } = config
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...init.headers,
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(this.buildUrl(path, params), {
      ...init,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle error response
      const error = data.error || { message: 'An error occurred' }
      throw new ApiError(response.status, error.code || 'UNKNOWN_ERROR', error.message, error.details)
    }

    return data
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params })
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)
