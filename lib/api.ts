/**
 * API Client for interacting with the backend.
 * Uses relative paths (/api) to leverage Next.js rewrites and bypass CORS.
 */

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
const BASE_PATH = `/api/${API_VERSION}`;

/**
 * Standard fetch wrapper that handles auth and JSON parsing.
 */
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // We'll assume the bearer token is stored in localStorage or a cookie.
  // For now, if one exists, we add it.
  const token = typeof window !== 'undefined' ? localStorage.getItem('defrag_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_PATH}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// ==========================================
// API Endpoints
// ==========================================

export const api = {
  /**
   * Generates or retrieves a blueprint object.
   */
  createBlueprint: async (data: any) => {
    return fetchClient('/blueprint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Retrieves a specific blueprint by ID.
   */
  getBlueprint: async (id: string) => {
    return fetchClient(`/blueprint/${id}`);
  },

  /**
   * Generates an interaction map.
   */
  createInteraction: async (data: any) => {
    return fetchClient('/interaction', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Retrieves timing data for a specific ID and date.
   */
  getTiming: async (id: string, date: string) => {
    return fetchClient(`/timing/${id}?date=${date}`);
  },

  /**
   * Submits the early access form.
   */
  requestEarlyAccess: async (data: { email: string; name?: string; company?: string; useCase?: string }) => {
     // NOTE: Replace '/early-access' with the actual endpoint once available.
     // For now, we simulate a successful request.
    return new Promise((resolve) => setTimeout(resolve, 1000));
    /*
    return fetchClient('/early-access', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    */
  }
};
