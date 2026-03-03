// API utility functions for DEFRAG frontend
// All API calls to api.defrag.app with Bearer token authentication

import type { 
  Connection, 
  Readout, 
  ChatResponse,
  NetworkBundle,
  SubscriptionStatus 
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.defrag.app';

import { getSession } from './supabase';

// Helper to get auth token (from Supabase session)
async function getAuthToken(): Promise<string | null> {
  const session = await getSession();
  return session?.access_token ?? null;
}

// Helper to make authenticated API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Context endpoints
export async function saveUserContext(city: string, timezone: string): Promise<void> {
  await apiCall('/api/context', {
    method: 'PUT',
    body: JSON.stringify({ city, timezone }),
  });
}

// Baseline endpoints
export async function saveBaseline(
  dob: string,
  birthTime: string | null,
  birthCity: string
): Promise<void> {
  await apiCall('/api/baseline', {
    method: 'PUT',
    body: JSON.stringify({ dob, birth_time: birthTime, birth_city: birthCity }),
  });
}

// Connection endpoints
export async function addConnection(data: {
  name: string;
  relationship_type: string;
  dob: string;
  birth_time?: string;
  birth_city?: string;
}): Promise<Connection> {
  return apiCall<Connection>('/api/connections', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getConnections(): Promise<Connection[]> {
  return apiCall<Connection[]>('/api/connections');
}

// Network bundle
export async function getNetworkBundle(): Promise<NetworkBundle> {
  return apiCall<NetworkBundle>('/api/network/bundle');
}

// Readout endpoints
export async function getSelfReadout(): Promise<Readout> {
  return apiCall<Readout>('/api/readout/self');
}

export async function getConnectionReadout(nodeId: string): Promise<Readout> {
  return apiCall<Readout>(`/api/readout/${nodeId}`);
}

// Chat endpoint
export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  return apiCall<ChatResponse>('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationId }),
  });
}

// Stripe checkout
export async function createCheckoutSession(
  mode: 'blueprint' | 'os'
): Promise<{ url: string }> {
  return apiCall<{ url: string }>('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  });
}

// Mock data for development (until API is ready)
export const mockSelfReadout: Readout = {
  locked: false,
  personName: 'You',
  insights: [
    {
      title: 'Energy Style',
      content: 'Your baseline shows a pattern of high sensitivity to environmental shifts. You process information deeply before acting.',
      category: 'energy_style',
    },
    {
      title: 'Friction Points',
      content: 'Current daily weather suggests heightened tension in rapid-decision contexts. Consider adding buffer time.',
      category: 'friction',
    },
    {
      title: 'Family Echoes',
      content: 'Your network shows inherited patterns around communication timing. This is neither good nor bad—just data.',
      category: 'family_echoes',
    },
  ],
};

export const mockLockedReadout: Readout = {
  locked: true,
  required: 'blueprint',
};

export const mockConnections: Connection[] = [
  {
    id: '1',
    user_id: 'mock',
    name: 'Alex',
    relationship_type: 'Partner',
    dob: '1990-05-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'mock',
    name: 'Morgan',
    relationship_type: 'Parent',
    dob: '1965-08-22',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
