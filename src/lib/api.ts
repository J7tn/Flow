import { supabase } from './supabase';
import { RateLimiter } from './validation';
import { getCurrentUser } from './supabase';
import type { 
  FlowTemplate, 
  TemplateReview, 
  ReviewVote, 
  TemplateUpload,
  TemplateStatus,
  ReviewStatus 
} from '@/types/templates';

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
    try {
      const client = supabase();
      if (!client) {
        return { success: false, error: 'Supabase client not available' };
      }

      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError) {
        return { success: false, error: `Authentication error: ${authError.message}` };
      }
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await client
        .from('workflow_instances')
        .select(`
          *,
          workflow_steps (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: `Failed to fetch flows: ${error.message}` };
      }

      return { success: true, data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching flows:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch flows' 
      };
    }
  },

  async createFlow(flowData: any) {
    try {
      const client = supabase();
      if (!client) {
        return { success: false, error: 'Supabase client not available' };
      }

      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError) {
        return { success: false, error: `Authentication error: ${authError.message}` };
      }
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Transform flow data to match workflow_instances schema
      const workflowInstanceData = {
        name: flowData.title,
        description: flowData.description || '',
        user_id: user.id,
        status: 'draft',
        current_step: 0,
        completed_steps: [],
        customizations: {
          richStepData: flowData.steps.map((step: any) => ({
            id: step.id,
            type: step.type,
            status: step.status,
            estimatedTime: step.estimatedTime,
            cost: step.cost,
            dependencies: step.dependencies,
            subFlow: step.subFlow,
            selectedCategory: step.selectedCategory,
          })),
        },
        notes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert the workflow instance
      const { data: workflowInstance, error: instanceError } = await client
        .from('workflow_instances')
        .insert(workflowInstanceData)
        .select()
        .single();

      if (instanceError) {
        console.error('Error creating workflow instance:', instanceError);
        return { success: false, error: `Failed to create workflow: ${instanceError.message}` };
      }

      // Insert the workflow steps
      if (flowData.steps && flowData.steps.length > 0) {
        const stepsData = flowData.steps.map((step: any, index: number) => ({
          workflow_instance_id: workflowInstance.id,
          title: step.title,
          description: step.description || '',
          step_type: step.type || 'task',
          order_index: index,
          estimated_duration_min: step.estimatedTime || 1,
          estimated_duration_max: step.estimatedTime ? step.estimatedTime + 1 : 2,
          duration_unit: 'days',
          required_skills: [],
          required_tools: step.selectedCategory ? [step.selectedCategory] : [],
          dependencies: step.dependencies || [],
          deliverables: [],
          acceptance_criteria: [],
          risk_level: 'medium',
          cost_estimate_min: step.cost || 0,
          cost_estimate_max: step.cost || 0,
          cost_currency: 'USD',
          automation_potential: 0,
          optimization_tips: [],
          is_completed: step.status === 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        console.log('Creating workflow steps:', stepsData);
        const { error: stepsError } = await client
          .from('workflow_steps')
          .insert(stepsData);

        if (stepsError) {
          console.error('Error creating workflow steps:', stepsError);
          // Don't fail the whole operation if steps creation fails
        } else {
          console.log('Successfully created workflow steps');
        }
      }

      return { success: true, data: workflowInstance, error: null };
    } catch (error) {
      console.error('Error creating flow:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create flow' 
      };
    }
  },

  async updateFlow(id: string, flowData: any) {
    try {
      const client = supabase();
      if (!client) {
        return { success: false, error: 'Supabase client not available' };
      }

      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError) {
        return { success: false, error: `Authentication error: ${authError.message}` };
      }
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Update the workflow instance
      const updateData = {
        name: flowData.title,
        description: flowData.description || '',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('workflow_instances')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: `Failed to update workflow: ${error.message}` };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error updating flow:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update flow' 
      };
    }
  },

  async deleteFlow(id: string) {
    try {
      const client = supabase();
      if (!client) {
        return { success: false, error: 'Supabase client not available' };
      }

      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError) {
        return { success: false, error: `Authentication error: ${authError.message}` };
      }
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await client
        .from('workflow_instances')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: `Failed to delete workflow: ${error.message}` };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting flow:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete flow' 
      };
    }
  },

  async getFlowById(id: string) {
    try {
      const client = supabase();
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await client
        .from('workflow_instances')
        .select(`
          *,
          workflow_steps (*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching flow:', error);
      throw error;
    }
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
      .from('user_profiles')
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
      .from('user_profiles')
      .update(profileData)
      .eq('id', userId.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadAvatar(file: File) {
    const userId = await getCurrentUser();
    if (!userId) throw new Error('Authentication required');

    const client = supabase();
    if (!client) throw new Error('Supabase client not available');

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, or GIF.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload a file smaller than 1MB.');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId.id}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await client.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = client.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with new avatar URL
    const { data, error } = await client
      .from('user_profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', userId.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
}; 

// Template Upload Functions
export const uploadTemplate = async (template: Omit<FlowTemplate, 'id' | 'lastUpdated' | 'rating' | 'usageCount'>): Promise<{ data: FlowTemplate | null; error: string | null }> => {
  try {
    console.log('Starting template upload with data:', template);
    
    const client = supabase();
    if (!client) {
      console.error('Supabase client not available');
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError) {
      console.error('Authentication error:', authError);
      return { data: null, error: `Authentication error: ${authError.message}` };
    }
    
    if (!user) {
      console.error('User not authenticated');
      return { data: null, error: 'User not authenticated' };
    }

    console.log('User authenticated:', user.id);

    const { data: profile, error: profileError } = await client
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Continue with default values if profile fetch fails
    }

    // Transform the template data to match database schema
    const templateData = {
      name: template.name,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      target_audience: template.targetAudience,
      estimated_duration_min: template.estimatedDuration.min,
      estimated_duration_max: template.estimatedDuration.max,
      duration_unit: template.estimatedDuration.unit,
      tags: template.tags,
      thumbnail_url: template.thumbnail,
      version: template.version,
      author_id: user.id,
      author_name: profile?.full_name || user.email || 'Anonymous',
      is_public: template.isPublic,
      steps: template.steps,
      cost_analysis: template.costAnalysis,
      recommended_tools: template.recommendedTools,
      optimization_suggestions: template.optimizationSuggestions,
      industry_context: template.industryContext,
      success_metrics: template.successMetrics,
      risks: template.risks,
      customization_options: template.customizationOptions,
      is_user_generated: template.isUserGenerated,
      status: template.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Transformed template data:', templateData);

    const { data, error: insertError } = await client
      .from('workflow_templates')
      .insert(templateData)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting template:', insertError);
      throw insertError;
    }

    console.log('Template inserted successfully:', data);

    // Create upload record
    const { error: uploadError } = await client
      .from('template_uploads')
      .insert({
        template_id: data.id,
        uploader_id: user.id,
        upload_date: new Date().toISOString(),
      });

    if (uploadError) {
      console.error('Error creating upload record:', uploadError);
      // Don't fail the whole operation if upload record creation fails
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error uploading template:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to upload template' 
    };
  }
};

export const getUserTemplates = async (): Promise<{ data: FlowTemplate[] | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await client
      .from('workflow_templates')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user templates:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch user templates' 
    };
  }
};

export const updateTemplateStatus = async (
  templateId: string, 
  status: TemplateStatus, 
  notes?: string
): Promise<{ data: FlowTemplate | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.moderation_notes = notes;
    }

    if (status === 'approved' || status === 'rejected') {
      updateData.moderated_by = user.id;
      updateData.moderated_at = new Date().toISOString();
    }

    const { data, error } = await client
      .from('workflow_templates')
      .update(updateData)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating template status:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to update template status' 
    };
  }
};

// Review Functions
export const submitReview = async (
  templateId: string,
  review: Omit<TemplateReview, 'id' | 'template_id' | 'reviewer_id' | 'reviewer_name' | 'status' | 'helpful_votes' | 'created_at' | 'updated_at'>
): Promise<{ data: TemplateReview | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data: profile } = await client
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const reviewData = {
      ...review,
      template_id: templateId,
      reviewer_id: user.id,
      reviewer_name: profile?.full_name || user.email || 'Anonymous',
      status: 'approved' as ReviewStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('template_reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to submit review' 
    };
  }
};

export const getTemplateReviews = async (templateId: string): Promise<{ data: TemplateReview[] | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data, error } = await client
      .from('template_reviews')
      .select('*')
      .eq('template_id', templateId)
      .eq('status', 'approved')
      .order('helpful_votes', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching template reviews:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch template reviews' 
    };
  }
};

export const getUserReview = async (templateId: string): Promise<{ data: TemplateReview | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await client
      .from('template_reviews')
      .select('*')
      .eq('template_id', templateId)
      .eq('reviewer_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user review:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch user review' 
    };
  }
};

export const updateReview = async (
  reviewId: string,
  review: Partial<Omit<TemplateReview, 'id' | 'template_id' | 'reviewer_id' | 'reviewer_name' | 'status' | 'helpful_votes' | 'created_at' | 'updated_at'>>
): Promise<{ data: TemplateReview | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const updateData = {
      ...review,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('template_reviews')
      .update(updateData)
      .eq('id', reviewId)
      .eq('reviewer_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating review:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to update review' 
    };
  }
};

export const deleteReview = async (reviewId: string): Promise<{ error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { error } = await client
      .from('template_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('reviewer_id', user.id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to delete review' 
    };
  }
};

// Review Vote Functions
export const voteReview = async (
  reviewId: string,
  isHelpful: boolean
): Promise<{ data: ReviewVote | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const voteData = {
      review_id: reviewId,
      voter_id: user.id,
      is_helpful: isHelpful,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('review_votes')
      .upsert(voteData, { onConflict: 'review_id,voter_id' })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error voting on review:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to vote on review' 
    };
  }
};

export const removeReviewVote = async (reviewId: string): Promise<{ error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { error: 'Supabase client not available' };
    }
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { error } = await client
      .from('review_votes')
      .delete()
      .eq('review_id', reviewId)
      .eq('voter_id', user.id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error removing review vote:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to remove review vote' 
    };
  }
};

// Template Upload Tracking Functions
export const getTemplateUploads = async (): Promise<{ data: TemplateUpload[] | null; error: string | null }> => {
  try {
    const client = supabase();
    if (!client) {
      return { data: null, error: 'Supabase client not available' };
    }
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await client
      .from('template_uploads')
      .select('*')
      .eq('uploader_id', user.id)
      .order('upload_date', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching template uploads:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch template uploads' 
    };
  }
}; 

// Test function to check Supabase connection and authentication
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string; user?: any }> => {
  try {
    const client = supabase();
    if (!client) {
      return { success: false, error: 'Supabase client not available' };
    }

    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError) {
      return { success: false, error: `Authentication error: ${authError.message}` };
    }

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Test database connection by trying to fetch user profile
    const { data: profiles, error: profileError } = await client
      .from('user_profiles')
      .select('*')
      .eq('id', user.id);

    if (profileError) {
      return { success: false, error: `Database error: ${profileError.message}`, user };
    }

    // Check if profile exists (it might not exist if the trigger didn't run)
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    
    if (!profile) {
      // Try to create a profile if it doesn't exist
      const { data: newProfile, error: createError } = await client
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        })
        .select()
        .single();
      
      if (createError) {
        return { success: false, error: `Failed to create user profile: ${createError.message}`, user };
      }
      
      return { success: true, user, profile: newProfile };
    }

    return { success: true, user, profile };
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}; 