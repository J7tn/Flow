import { getCurrentUser } from './supabase';

// Chat2API Configuration
const CHAT2API_BASE_URL = import.meta.env.VITE_CHAT2API_URL || 'http://127.0.0.1:5005';
const CHAT2API_AUTHORIZATION = import.meta.env.VITE_CHAT2API_AUTHORIZATION || '';

// Types for Chat2API
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
  }>;
}

// Chat2API Service Class
export class Chat2APIService {
  private static async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization if configured
    if (CHAT2API_AUTHORIZATION) {
      headers['Authorization'] = `Bearer ${CHAT2API_AUTHORIZATION}`;
    }

    return headers;
  }

  private static async validateUser(): Promise<string | null> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Authentication required for AI features');
    }
    return user.id;
  }

  // Create chat completion (non-streaming)
  static async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    try {
      await this.validateUser();
      
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${CHAT2API_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          stream: false, // Ensure non-streaming for this method
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat2API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat2API completion error:', error);
      throw error;
    }
  }

  // Create streaming chat completion
  static async createStreamingChatCompletion(
    request: ChatCompletionRequest,
    onChunk: (chunk: ChatCompletionChunk) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      await this.validateUser();
      
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${CHAT2API_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat2API streaming error: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete?.();
              return;
            }

            try {
              const chunk: ChatCompletionChunk = JSON.parse(data);
              onChunk(chunk);
            } catch (parseError) {
              console.warn('Failed to parse chunk:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat2API streaming error:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown streaming error'));
    }
  }

  // Get available models
  static async getModels(): Promise<{ id: string; object: string }[]> {
    try {
      await this.validateUser();
      
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${CHAT2API_BASE_URL}/v1/models`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Chat2API models error:', error);
      throw error;
    }
  }

  // Check service health
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Chat2API health check failed:', error);
      return false;
    }
  }
}

// Utility functions for common AI tasks in Flow
export class FlowAI {
  // Generate workflow suggestions based on project description
  static async generateWorkflowSuggestions(projectDescription: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert workflow designer. Based on the project description, suggest a step-by-step workflow that teams can follow. 
        Focus on practical, actionable steps that help teams stay organized and efficient. 
        Return the response as a clear, structured workflow with numbered steps.`
      },
      {
        role: 'user',
        content: `Please suggest a workflow for this project: ${projectDescription}`
      }
    ];

    const response = await Chat2APIService.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Unable to generate suggestions.';
  }

  // Optimize existing workflow
  static async optimizeWorkflow(workflowSteps: string[]): Promise<string> {
    const workflowText = workflowSteps.map((step, index) => `${index + 1}. ${step}`).join('\n');
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a workflow optimization expert. Analyze the given workflow and suggest improvements for efficiency, clarity, and effectiveness. 
        Focus on reducing redundancy, improving clarity, and adding missing steps that would be valuable.`
      },
      {
        role: 'user',
        content: `Please optimize this workflow:\n${workflowText}`
      }
    ];

    const response = await Chat2APIService.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.6,
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content || 'Unable to optimize workflow.';
  }

  // Generate cost estimation for workflow
  static async estimateWorkflowCosts(workflowSteps: string[]): Promise<string> {
    const workflowText = workflowSteps.map((step, index) => `${index + 1}. ${step}`).join('\n');
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a project cost estimation expert. Analyze the workflow steps and provide a rough cost estimation including:
        1. Time estimates for each step
        2. Resource requirements (tools, software, personnel)
        3. Potential cost savings or optimizations
        4. Risk factors that could affect costs
        
        Format your response in a clear, structured manner.`
      },
      {
        role: 'user',
        content: `Please estimate costs for this workflow:\n${workflowText}`
      }
    ];

    const response = await Chat2APIService.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.5,
      max_tokens: 800,
    });

    return response.choices[0]?.message?.content || 'Unable to estimate costs.';
  }

  // Generate template suggestions
  static async generateTemplateSuggestions(projectType: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a template creation expert. Based on the project type, suggest a comprehensive workflow template that teams can use as a starting point. 
        Include all necessary steps, checkpoints, and deliverables. Make it practical and actionable.`
      },
      {
        role: 'user',
        content: `Please create a workflow template for: ${projectType}`
      }
    ];

    const response = await Chat2APIService.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Unable to generate template.';
  }
}

// Export default instance for easy use
export default Chat2APIService; 