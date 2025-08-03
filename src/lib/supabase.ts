import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client only when needed
let supabaseInstance: any = null;

const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Authentication features will be disabled.');
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
};

const createSupabaseClient = () => {
  const config = getSupabaseConfig();
  
  if (!config) {
    return null;
  }

  console.log('Creating new Supabase client with URL:', config.supabaseUrl);

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'flow-web-app',
      },
    },
  });
};

export const supabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
};

// Force refresh the Supabase client (useful when buckets are created)
export const refreshSupabaseClient = () => {
  console.log('Refreshing Supabase client...');
  supabaseInstance = null;
  return supabase();
};

// Security helper functions
export const getCurrentUser = async () => {
  try {
    const client = supabase();
    if (!client) return null;
    
    const { data: { user }, error } = await client.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const client = supabase();
    if (!client) return null;
    
    const { data: { session }, error } = await client.auth.getSession();
    if (error) {
      console.error('Error getting current session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
}; 