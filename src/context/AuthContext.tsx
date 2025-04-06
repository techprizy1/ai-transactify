
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserSubscription } from '@/types/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isPro: boolean;
  checkTransactionLimit: () => Promise<boolean>;
  signOut: () => Promise<void>;
  upgradeAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isPro: false,
  checkTransactionLimit: async () => true,
  signOut: async () => {},
  upgradeAccount: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event);
            setSession(session);
            setUser(session?.user ?? null);
            
            // Check subscription status when auth state changes
            if (session?.user) {
              checkSubscriptionStatus(session.user.id);
            } else {
              setIsPro(false);
            }
            
            setLoading(false);
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check subscription status on initial load
        if (session?.user) {
          checkSubscriptionStatus(session.user.id);
        }
        
        setLoading(false);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      // Since we don't have a formal user_subscriptions table in Supabase yet,
      // we'll check if there are any existing subscriptions with this query
      // This is a mock implementation that assumes the table exists
      const { data, error } = await supabase
        .from('transactions') // Using an existing table for type safety
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      // Mock subscription data - in reality, we would use user_subscriptions table
      // This simulates having an active subscription if the user has any transactions
      setIsPro(data && data.length > 0);
      
      if (error) {
        console.error('Error checking subscription status:', error);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsPro(false);
    }
  };

  const checkTransactionLimit = async (): Promise<boolean> => {
    if (isPro) return true; // Pro users have unlimited transactions
    
    try {
      // Count existing transactions for free users
      const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error counting transactions:', error);
        return false;
      }
      
      // Free users can create up to 5 transactions
      return (count !== null && count < 5);
    } catch (error) {
      console.error('Error checking transaction limit:', error);
      return false;
    }
  };

  const upgradeAccount = async () => {
    try {
      toast.info('Initiating upgrade to Pro account...');
      
      // This is a mock implementation without the actual user_subscriptions table
      // In a real implementation, this would connect to a payment processor
      // and then create a subscription record
      
      // For demo purposes, we'll just set the user as pro locally
      setIsPro(true);
      toast.success('Successfully upgraded to Pro!');
      
      // Store this information in local storage for persistence
      // Note: In a real app, we would store this in the database
      localStorage.setItem('isPro', 'true');
      
    } catch (error) {
      console.error('Error upgrading account:', error);
      toast.error('Failed to upgrade account. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsPro(false);
      localStorage.removeItem('isPro');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    loading,
    isPro,
    checkTransactionLimit,
    signOut,
    upgradeAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
