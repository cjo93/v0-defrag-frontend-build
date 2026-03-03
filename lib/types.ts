// Core type definitions for DEFRAG

export type SubscriptionStatus = 'none' | 'blueprint_unlocked' | 'os_active';

export interface Profile {
  user_id: string;
  email: string;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface UserContext {
  user_id: string;
  city?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface Baseline {
  id: string;
  user_id: string;
  dob: string; // ISO date string
  birth_time?: string; // HH:MM:SS
  birth_city: string;
  created_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  name: string;
  relationship_type: string; // e.g., "Partner", "Parent", "Child", "Sibling", "Friend"
  dob: string;
  birth_time?: string;
  birth_city?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  tier?: 'GREEN' | 'YELLOW' | 'RED'; // Only for assistant messages, never shown to user
  created_at: string;
}

export interface ReadoutInsight {
  title: string;
  content: string;
  category: 'energy_style' | 'friction' | 'family_echoes' | 'daily_weather';
}

export interface Readout {
  locked: boolean;
  required?: 'blueprint' | 'os';
  personName?: string;
  insights?: ReadoutInsight[];
}

export interface ChatResponse {
  headline: string;
  signal: 'low' | 'medium' | 'high';
  confidence: {
    overall: number;
    data_confidence: number;
    pattern_confidence: number;
  };
  whats_happening: string[];
  do_this_now: string;
  one_line_to_say: string;
  repeat_pattern?: string | null;
  safety?: string | null;
}

export interface NetworkBundle {
  profile: Profile;
  context?: UserContext;
  baseline?: Baseline;
  connections: Connection[];
}
