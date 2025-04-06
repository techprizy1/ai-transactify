
export type UserSubscription = {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
};

// This is a type definition for our mock user_subscriptions table
// In a production app, this would be generated from Supabase
export type UserSubscriptionTable = {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
};
