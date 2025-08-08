import { getCurrentUser } from './supabase';

// Chat2API Configuration
const CHAT2API_BASE_URL = import.meta.env.VITE_CHAT2API_URL || 'http://127.0.0.1:5005';
const CHAT2API_AUTHORIZATION = import.meta.env.VITE_CHAT2API_AUTHORIZATION || '';

// Check if Chat2API is available in production
const isChat2APIAvailable = () => {
  if (import.meta.env.PROD) {
    // In production, only use Chat2API if it's not localhost
    return CHAT2API_BASE_URL && 
           !CHAT2API_BASE_URL.includes('localhost') && 
           !CHAT2API_BASE_URL.includes('127.0.0.1');
  }
  return CHAT2API_BASE_URL && CHAT2API_BASE_URL.includes('localhost'); // Available in development if localhost
};

// Rate limiting and retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 5000]; // Delays in milliseconds
const RATE_LIMIT_WINDOW = 60000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // Max requests per minute

// Rate limiting state
let requestCount = 0;
let windowStart = Date.now();

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

// Enhanced error types
export class Chat2APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable: boolean = false,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'Chat2APIError';
  }
}

// Rate limiting helper
function checkRateLimit(): boolean {
  const now = Date.now();
  
  // Reset window if expired
  if (now - windowStart > RATE_LIMIT_WINDOW) {
    requestCount = 0;
    windowStart = now;
  }
  
  // Check if we're within limits
  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  requestCount++;
  return true;
}

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on certain errors
      if (error instanceof Chat2APIError && !error.retryable) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
      console.log(`Chat2API retry attempt ${attempt + 1}/${maxRetries + 1} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Chat2API Service Class
export class Chat2APIService {
  private static async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization if configured
    if (CHAT2API_AUTHORIZATION && !import.meta.env.DEV) {
      headers['X-API-Key'] = CHAT2API_AUTHORIZATION;
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

  // Enhanced error handling for API responses
  private static handleAPIError(response: Response, errorText: string): never {
    const status = response.status;
    let retryable = false;
    let retryAfter: number | undefined;
    
    // Check for retryable errors
    if (status === 429 || status === 500 || status === 502 || status === 503) {
      retryable = true;
      retryAfter = parseInt(response.headers.get('Retry-After') || '60') * 1000;
    }
    
    // Special handling for 403 rate limiting
    if (status === 403 && errorText.includes('Unusual activity')) {
      retryable = true;
      retryAfter = 30000; // Wait 30 seconds for unusual activity
    }
    
    throw new Chat2APIError(
      `Chat2API error: ${status} - ${errorText}`,
      status,
      retryable,
      retryAfter
    );
  }

  // Create chat completion (non-streaming) with enhanced error handling
  static async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    // Check if Chat2API is available
    if (!isChat2APIAvailable()) {
      throw new Chat2APIError(
        'Chat2API is not available in production. Please configure a public Chat2API URL.',
        503,
        false
      );
    }

    return retryWithBackoff(async () => {
      // Check rate limiting
      if (!checkRateLimit()) {
        throw new Chat2APIError(
          'Rate limit exceeded. Please wait before making more requests.',
          429,
          true,
          60000
        );
      }
      
      await this.validateUser();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${CHAT2API_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.handleAPIError(response, errorText);
      }

      return await response.json();
    });
  }

  // Create streaming chat completion with enhanced error handling
  static async createStreamingChatCompletion(
    request: ChatCompletionRequest,
    onChunk: (chunk: ChatCompletionChunk) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    // Check if Chat2API is available
    if (!isChat2APIAvailable()) {
      throw new Chat2APIError(
        'Chat2API is not available in production. Please configure a public Chat2API URL.',
        503,
        false
      );
    }

    return retryWithBackoff(async () => {
      // Check rate limiting
      if (!checkRateLimit()) {
        throw new Chat2APIError(
          'Rate limit exceeded. Please wait before making more requests.',
          429,
          true,
          60000
        );
      }
      
      await this.validateUser();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${CHAT2API_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.handleAPIError(response, errorText);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
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
        onError?.(error instanceof Error ? error : new Error('Unknown streaming error'));
        throw error;
      }
    });
  }

  // Get available models with enhanced error handling
  static async getModels(): Promise<{ id: string; object: string }[]> {
    // Check if Chat2API is available
    if (!isChat2APIAvailable()) {
      throw new Chat2APIError(
        'Chat2API is not available in production. Please configure a public Chat2API URL.',
        503,
        false
      );
    }

    return retryWithBackoff(async () => {
      await this.validateUser();
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${CHAT2API_BASE_URL}/v1/models`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.handleAPIError(response, errorText);
      }

      const data = await response.json();
      return data.data || [];
    });
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

  // Get current rate limit status
  static getRateLimitStatus(): { requestsUsed: number; requestsRemaining: number; windowReset: number } {
    const now = Date.now();
    const windowReset = windowStart + RATE_LIMIT_WINDOW;
    const requestsRemaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - requestCount);
    
    return {
      requestsUsed: requestCount,
      requestsRemaining,
      windowReset
    };
  }
}

// Utility functions for common AI tasks in Flow
export class FlowAI {
  // Generate workflow suggestions based on project description
  static async generateWorkflowSuggestions(projectDescription: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are an expert flow designer. Based on the project description, suggest a step-by-step workflow that teams can follow. 
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
    } catch (error) {
      if (error instanceof Chat2APIError) {
        if (error.status === 403 && error.message.includes('Unusual activity')) {
          return 'AI service is temporarily unavailable due to high activity. Please try again in a few minutes.';
        }
        if (error.status === 429) {
          return 'AI service is busy. Please wait a moment before trying again.';
        }
        return `AI service error: ${error.message}`;
      }
      return 'Unable to generate suggestions due to a technical issue.';
    }
  }

  // Optimize existing workflow
  static async optimizeWorkflow(workflowSteps: string[]): Promise<string> {
    try {
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
    } catch (error) {
      if (error instanceof Chat2APIError) {
        if (error.status === 403 && error.message.includes('Unusual activity')) {
          return 'AI service is temporarily unavailable due to high activity. Please try again in a few minutes.';
        }
        if (error.status === 429) {
          return 'AI service is busy. Please wait a moment before trying again.';
        }
        return `AI service error: ${error.message}`;
      }
      return 'Unable to optimize workflow due to a technical issue.';
    }
  }

  // Generate cost estimation for workflow
  static async estimateWorkflowCosts(workflowSteps: string[]): Promise<string> {
    try {
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
    } catch (error) {
      if (error instanceof Chat2APIError) {
        if (error.status === 403 && error.message.includes('Unusual activity')) {
          return 'AI service is temporarily unavailable due to high activity. Please try again in a few minutes.';
        }
        if (error.status === 429) {
          return 'AI service is busy. Please wait a moment before trying again.';
        }
        return `AI service error: ${error.message}`;
      }
      return 'Unable to estimate costs due to a technical issue.';
    }
  }

  // Generate template suggestions
  static async generateTemplateSuggestions(projectType: string): Promise<string> {
    try {
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
    } catch (error) {
      if (error instanceof Chat2APIError) {
        if (error.status === 403 && error.message.includes('Unusual activity')) {
          return 'AI service is temporarily unavailable due to high activity. Please try again in a few minutes.';
        }
        if (error.status === 429) {
          return 'AI service is busy. Please wait a moment before trying again.';
        }
        return `AI service error: ${error.message}`;
      }
      return 'Unable to generate template due to a technical issue.';
    }
  }
}

// Export default instance for easy use
export default Chat2APIService; 