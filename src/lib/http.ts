import { auth } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage: string;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || 'An error occurred';
    } catch {
      errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
    }
    
    throw new HttpError(errorMessage, response.status, response.statusText);
  }
  
  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as T;
}

export async function http<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };
  
  // Add auth token if available and not skipped
  if (!skipAuth) {
    const token = auth.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new HttpError('Network error - unable to connect to server', 0, 'Network Error');
    }
    
    throw new HttpError('An unexpected error occurred', 0, 'Unknown Error');
  }
}

// Convenience methods
export const httpClient = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    http<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    http<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    
  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    http<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    
  patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    http<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    http<T>(endpoint, { ...options, method: 'DELETE' }),
};
