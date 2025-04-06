
export type UserSubscription = {
  id: string;
  user_id: string;
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
};
