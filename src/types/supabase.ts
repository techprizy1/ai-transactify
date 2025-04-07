export type UserSubscriptionTable = {
  id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
};
