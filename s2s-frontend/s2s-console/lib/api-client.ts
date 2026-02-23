/**
 * API Client Utilities
 * Centralized fetch wrapper with timeout, error handling, and retry logic
 */

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

/**
 * Fetch with timeout and error handling
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Fetch API response with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${CMS_BACKEND_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }, timeout);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, use status text
        errorData = { error: response.statusText || 'Request failed' };
      }

      const error: ApiError = {
        message: errorData.error || errorData.message || 'Request failed',
        status: response.status,
        details: errorData,
      };

      throw error;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    // Re-throw ApiError as-is
    if (error.message && error.status !== undefined) {
      throw error;
    }

    // Wrap other errors
    const apiError: ApiError = {
      message: error.message || 'Network error occurred',
      details: error,
    };

    throw apiError;
  }
}

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error: any) {
      console.error(`Error writing to localStorage (${key}):`, error);
      
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('localStorage quota exceeded. Attempting cleanup...');
        // Try to clear old diagnostic data
        try {
          localStorage.removeItem('diagnostic_questions');
          localStorage.removeItem('diagnostic_session_id');
          localStorage.setItem(key, value);
          return true;
        } catch (retryError) {
          console.error('Failed to free localStorage space:', retryError);
          return false;
        }
      }
      
      return false;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  },

  getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage (${key}):`, error);
      return null;
    }
  },

  setJSON(key: string, value: any): boolean {
    try {
      const json = JSON.stringify(value);
      return this.setItem(key, json);
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage (${key}):`, error);
      return false;
    }
  },
};
