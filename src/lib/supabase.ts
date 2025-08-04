import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client only when needed
let supabaseInstance: any = null;

const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('Supabase Config Check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
    environment: import.meta.env.MODE,
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase environment variables missing:', {
      VITE_SUPABASE_URL: supabaseUrl ? '✅ Set' : '❌ Missing',
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '✅ Set' : '❌ Missing'
    });
    
    if (import.meta.env.PROD) {
      console.error('🚨 PRODUCTION: Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel environment variables.');
    } else {
      console.error('🚨 DEVELOPMENT: Supabase credentials not configured. Please run setup-env.bat and update the .env file with your Supabase credentials.');
    }
    
    return null;
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('❌ Invalid Supabase URL format:', supabaseUrl);
    return null;
  }

  // Validate key format (should start with eyJ)
  if (!supabaseAnonKey.startsWith('eyJ')) {
    console.error('❌ Invalid Supabase anon key format. Should start with "eyJ"');
    return null;
  }

  console.log('✅ Supabase configuration validated successfully');
  return { supabaseUrl, supabaseAnonKey };
};

const createSupabaseClient = () => {
  const config = getSupabaseConfig();
  
  if (!config) {
    console.error('❌ Cannot create Supabase client - configuration invalid');
    return null;
  }

  console.log('🔧 Creating new Supabase client with URL:', config.supabaseUrl);

  try {
    const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
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

    console.log('✅ Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    return null;
  }
};

export const supabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
};

// Force refresh the Supabase client (useful when buckets are created)
export const refreshSupabaseClient = () => {
  console.log('🔄 Refreshing Supabase client...');
  supabaseInstance = null;
  return supabase();
};

// Security helper functions
export const getCurrentUser = async () => {
  try {
    const client = supabase();
    if (!client) {
      console.error('❌ Cannot get current user - Supabase client not available');
      return null;
    }
    
    const { data: { user }, error } = await client.auth.getUser();
    if (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const client = supabase();
    if (!client) {
      console.error('❌ Cannot get current session - Supabase client not available');
      return null;
    }
    
    const { data: { session }, error } = await client.auth.getSession();
    if (error) {
      console.error('❌ Error getting current session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('❌ Error getting current session:', error);
    return null;
  }
};

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return config !== null;
}; 