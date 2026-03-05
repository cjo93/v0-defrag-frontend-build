export type StagedSession = {
  session_id?: string;
  manual_type: 'individual' | 'relational';
  relationship_context?: string;
  status: 'pending_payment' | 'unlocked' | 'processing' | 'completed' | 'failed';
  precision_badge: 'high' | 'standard';
  target_data?: any;
  primary_data?: any;
  secondary_data?: any;
  created_at?: string;
  updated_at?: string;
};

// DEFRAG Core Types
export type Plan = 'free' | 'solo' | 'team';

export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'unlocked' | 'pending';

export type Profile = {
  user_id: string;
  email: string;
  plan: Plan;
  subscription_status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
};

export type Birthline = {
  id: string;
  user_id: string;
  dob: string; // ISO date
  birth_time?: string; // HH:MM:SS
  birth_city: string;
  created_at: string;
  updated_at: string;
};

export type ConnectionStatus = 'active' | 'invited' | 'pending' | 'archived';

export type Connection = {
  id: string;
  user_id: string;
  name: string;
  relationship_type?: string;
  dob?: string;
  birth_time?: string;
  birth_city?: string;
  invite_email?: string;
  invite_token?: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  connection_id?: string;
  title?: string;
  created_at: string;
  updated_at: string;
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type Message = {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
};

// User status for routing decisions
export type UserStatus = {
  profile_ready: boolean;
  has_birthline: boolean;
  has_relationships: boolean;
  is_free_unlocked: boolean;
  is_solo_unlocked: boolean;
  is_team_unlocked: boolean;
  plan: Plan;
  subscription_status: SubscriptionStatus;
};
