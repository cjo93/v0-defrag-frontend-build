export type BillingEventType =
  | 'checkout_session_created'
  | 'webhook_event_received'
  | 'subscription_status_updated'
  | 'paid_access_denied'
  | 'paid_access_granted';

export type BillingLogPayload = {
  event_type: BillingEventType;
  user_id?: string | null;
  plan?: string | null;
  subscription_status?: string | null;
  stripe_customer_id?: string | null;
  stripe_event_id?: string | null;
  stripe_event_type?: string | null;
  duplicate?: boolean;
};

export function logBillingEvent(payload: BillingLogPayload) {
  console.log('[DEFRAG_BILLING]', JSON.stringify(payload));
}
