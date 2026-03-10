// lib/api.ts
import { getClientApiBase, getServerApiBase } from './config';
import type {
  Connection,
  Readout,
  ChatResponse,
  NetworkBundle,
} from './types';
import { getSession } from './supabase';

/** Server-side fetch helper. If no base, call local route by absolute path. */
export async function serverApiFetch(path: string, opts: RequestInit = {}) {
  const base = getServerApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = base ? `${base}${normalizedPath}` : normalizedPath;
  return fetch(url, opts);
}

/** Client-side API fetcher. Always hits /api/* by default. */
export async function clientApiFetch(path: string, opts: RequestInit = {}) {
  const localUrl = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : `/${path}`}`;
  const externalBase = getClientApiBase();
  const url = externalBase ? `${externalBase}${localUrl}` : localUrl;
  return fetch(url, { credentials: 'include', ...opts });
}

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
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await clientApiFetch(endpoint, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errMsg = (json as any)?.message || (json as any)?.error || `API Error: ${response.status} ${response.statusText}`;
    throw new Error(errMsg);
  }

  return json as T;
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

/** Map legacy checkout aliases to canonical plans. */
type CheckoutMode = 'blueprint' | 'os' | 'free' | 'solo' | 'team';

function legacyToCanonical(planOrAlias: CheckoutMode): 'free' | 'solo' | 'team' {
  if (planOrAlias === 'blueprint') return 'solo';
  if (planOrAlias === 'os') return 'team';
  if (planOrAlias === 'solo' || planOrAlias === 'team') return planOrAlias;
  return 'free';
}

/** Preserve exported createCheckoutSession name/signature; return parsed JSON. */
export type CheckoutSessionResult = { url: string };

export async function createCheckoutSession(mode: CheckoutMode): Promise<CheckoutSessionResult> {
  const plan = legacyToCanonical(mode);
  const res = await clientApiFetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = (json as any)?.message || (json as any)?.error || `checkout_failed (${res.status})`;
    const err = new Error(errMsg);
    (err as any).status = res.status;
    (err as any).body = json;
    throw err;
  }
  if (!json || typeof (json as any).url !== 'string') {
    throw new Error('checkout_url_missing');
  }

  return { url: (json as any).url };
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
