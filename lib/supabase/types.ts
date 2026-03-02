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
