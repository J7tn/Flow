import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing authentication...');
    console.log('AuthProvider: Current URL:', window.location.href);
    console.log('AuthProvider: Environment:', import.meta.env.MODE);
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const client = supabase();
        if (!client) {
          console.log('AuthProvider: Supabase not available, skipping authentication');
          setLoading(false);
          return;
        }
        
        const { data: { session }, error } = await client.auth.getSession();
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        }
        console.log('AuthProvider: Initial session:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('AuthProvider: Error getting initial session:', error);
      } finally {
        setLoading(false);
        console.log('AuthProvider: Initial loading complete');
      }
    };

    getInitialSession();

    // Listen for auth changes
    try {
      console.log('AuthProvider: Setting up auth state listener...');
      const client = supabase();
      if (!client) {
        console.log('AuthProvider: Supabase not available, skipping auth listener');
        setLoading(false);
        return;
      }
      
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          console.log('AuthProvider: Auth state changed:', event, session ? 'Session found' : 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('AuthProvider: Error setting up auth listener:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const client = supabase();
      if (!client) {
        const errorMessage = import.meta.env.PROD 
          ? 'Authentication service unavailable. Please contact support - Supabase not configured in production.'
          : 'Authentication service unavailable. Please run setup-env.bat and configure your .env file with Supabase credentials.';
        return { error: { message: errorMessage } as AuthError };
      }
      
      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      const errorMessage = import.meta.env.PROD 
        ? 'Authentication service unavailable. Please try again later or contact support.'
        : 'Authentication service unavailable. Please check your Supabase configuration.';
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const client = supabase();
      if (!client) {
        const errorMessage = import.meta.env.PROD 
          ? 'Authentication service unavailable. Please contact support - Supabase not configured in production.'
          : 'Authentication service unavailable. Please run setup-env.bat and configure your .env file with Supabase credentials.';
        return { error: { message: errorMessage } as AuthError };
      }
      
      const { error } = await client.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      const errorMessage = import.meta.env.PROD 
        ? 'Authentication service unavailable. Please try again later or contact support.'
        : 'Authentication service unavailable. Please check your Supabase configuration.';
      return { error: { message: errorMessage } as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const client = supabase();
      if (!client) return;
      
      await client.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const client = supabase();
      if (!client) {
        return { error: { message: 'Authentication service unavailable' } as AuthError };
      }
      
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: { message: 'Authentication service unavailable' } as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 