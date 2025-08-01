import { supabase } from './supabase';
import { RateLimiter } from './validation';
import { getCurrentUser } from './supabase';

// Rate limiter instance
const apiRateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

// API response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Secure API wrapper
export class SecureApi {
  private static async validateUser(): Promise<string | null> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user.id;
  }

  private static async validateRateLimit(identifier: string): Promise<void> {
    if (!apiRateLimiter.isAllowed(identifier)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  }

  // Secure GET request
  static async get<T>(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, any>;
      pagination?: { page: number; limit: number };
      userId?: string;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const userId = await this.validateUser();
      const identifier = `${userId}-${table}-get`;
      await this.validateRateLimit(identifier);

      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }
      
      let query = client
        .from(table)
        .select(options.select || '*');

      // Apply user-based filtering for security
      if (options.userId) {
        query = query.eq('user_id', options.userId);
      } else {
        // Default to current user's data
        query = query.eq('user_id', userId);
      }

      // Apply additional filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply pagination
      if (options.pagination) {
        const { page, limit } = options.pagination;
        const from = page * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data as T,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(`API GET error for ${table}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      };
    }
  }

  // Secure POST request
  static async post<T>(
    table: string,
    data: any,
    options: { validateSchema?: any } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const userId = await this.validateUser();
      const identifier = `${userId}-${table}-post`;
      await this.validateRateLimit(identifier);

      // Validate data if schema provided
      if (options.validateSchema) {
        const validatedData = options.validateSchema.parse(data);
        data = validatedData;
      }

      // Ensure user_id is set for security
      const secureData = {
        ...data,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data: result, error } = await client
        .from(table)
        .insert(secureData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(`API POST error for ${table}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      };
    }
  }

  // Secure PUT request
  static async put<T>(
    table: string,
    id: string,
    data: any,
    options: { validateSchema?: any } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const userId = await this.validateUser();
      const identifier = `${userId}-${table}-put`;
      await this.validateRateLimit(identifier);

      // Validate data if schema provided
      if (options.validateSchema) {
        const validatedData = options.validateSchema.parse(data);
        data = validatedData;
      }

      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }

      // Ensure user owns the resource
      const { data: existing } = await client
        .from(table)
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existing || existing.user_id !== userId) {
        throw new Error('Access denied');
      }

      const secureData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { data: result, error } = await client
        .from(table)
        .update(secureData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(`API PUT error for ${table}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      };
    }
  }

  // Secure DELETE request
  static async delete(
    table: string,
    id: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const userId = await this.validateUser();
      const identifier = `${userId}-${table}-delete`;
      await this.validateRateLimit(identifier);

      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }

      // Ensure user owns the resource
      const { data: existing } = await client
        .from(table)
        .select('user_id')
        .eq('id', id)
        .single();

      if (!existing || existing.user_id !== userId) {
        throw new Error('Access denied');
      }

      const { error } = await client
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        data: true,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(`API DELETE error for ${table}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      };
    }
  }
}

// Flow-specific API functions
export const flowApi = {
  async getFlows(userId?: string) {
    return SecureApi.get('flows', { userId });
  },

  async createFlow(flowData: any) {
    return SecureApi.post('flows', flowData);
  },

  async updateFlow(id: string, flowData: any) {
    return SecureApi.put('flows', id, flowData);
  },

  async deleteFlow(id: string) {
    return SecureApi.delete('flows', id);
  },

  async getFlowById(id: string) {
    const userId = await getCurrentUser();
    if (!userId) throw new Error('Authentication required');

    const client = supabase();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client
      .from('flows')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId.id)
      .single();

    if (error) throw error;
    return data;
  },
};

// User profile API functions
export const userApi = {
  async getProfile() {
    const userId = await getCurrentUser();
    if (!userId) throw new Error('Authentication required');

    const client = supabase();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(profileData: any) {
    const userId = await getCurrentUser();
    if (!userId) throw new Error('Authentication required');

    const client = supabase();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client
      .from('profiles')
      .update(profileData)
      .eq('id', userId.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
}; 