import { useState, useCallback, useRef } from 'react';
import { Chat2APIService, FlowAI, ChatMessage, ChatCompletionRequest } from '../chat2api';

export interface UseChat2APIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onError?: (error: Error) => void;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  lastResponse: string | null;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  sendStreamingMessage: (content: string, onChunk?: (content: string) => void) => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: ChatMessage) => void;
  generateWorkflowSuggestions: (projectDescription: string) => Promise<string>;
  optimizeWorkflow: (workflowSteps: string[]) => Promise<string>;
  estimateWorkflowCosts: (workflowSteps: string[]) => Promise<string>;
  generateTemplateSuggestions: (projectType: string) => Promise<string>;
  healthCheck: () => Promise<boolean>;
}

export function useChat2API(options: UseChat2APIOptions = {}): ChatState & ChatActions {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isStreaming: false,
    error: null,
    lastResponse: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens = 1000,
    onError,
  } = options;

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
    if (error && onError) {
      onError(new Error(error));
    }
  }, [onError]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      const userMessage: ChatMessage = { role: 'user', content };
      const newMessages = [...state.messages, userMessage];

      setState(prev => ({ ...prev, messages: newMessages }));

      const request: ChatCompletionRequest = {
        model,
        messages: newMessages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      };

      const response = await Chat2APIService.createChatCompletion(request);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'No response received.',
      };

      setState(prev => ({
        ...prev,
        messages: [...newMessages, assistantMessage],
        isLoading: false,
        lastResponse: assistantMessage.content,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      setError(errorMessage);
    }
  }, [state.messages, model, temperature, maxTokens, setError]);

  const sendStreamingMessage = useCallback(async (
    content: string,
    onChunk?: (content: string) => void
  ) => {
    try {
      // Cancel any ongoing streaming request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        isStreaming: true,
        error: null,
      }));

      const userMessage: ChatMessage = { role: 'user', content };
      const newMessages = [...state.messages, userMessage];

      setState(prev => ({ ...prev, messages: newMessages }));

      const request: ChatCompletionRequest = {
        model,
        messages: newMessages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      };

      let fullResponse = '';

      await Chat2APIService.createStreamingChatCompletion(
        request,
        (chunk) => {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            onChunk?.(content);
          }
        },
        () => {
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: fullResponse,
          };

          setState(prev => ({
            ...prev,
            messages: [...newMessages, assistantMessage],
            isStreaming: false,
            lastResponse: fullResponse,
          }));
        },
        (error) => {
          setState(prev => ({
            ...prev,
            isStreaming: false,
            error: error.message,
          }));
          setError(error.message);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send streaming message';
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: errorMessage,
      }));
      setError(errorMessage);
    }
  }, [state.messages, model, temperature, maxTokens, setError]);

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      lastResponse: null,
      error: null,
    }));
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const generateWorkflowSuggestions = useCallback(async (projectDescription: string): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await FlowAI.generateWorkflowSuggestions(projectDescription);
      setState(prev => ({ ...prev, isLoading: false, lastResponse: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      setError(errorMessage);
      throw error;
    }
  }, [setError]);

  const optimizeWorkflow = useCallback(async (workflowSteps: string[]): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await FlowAI.optimizeWorkflow(workflowSteps);
      setState(prev => ({ ...prev, isLoading: false, lastResponse: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize workflow';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      setError(errorMessage);
      throw error;
    }
  }, [setError]);

  const estimateWorkflowCosts = useCallback(async (workflowSteps: string[]): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await FlowAI.estimateWorkflowCosts(workflowSteps);
      setState(prev => ({ ...prev, isLoading: false, lastResponse: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to estimate costs';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      setError(errorMessage);
      throw error;
    }
  }, [setError]);

  const generateTemplateSuggestions = useCallback(async (projectType: string): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await FlowAI.generateTemplateSuggestions(projectType);
      setState(prev => ({ ...prev, isLoading: false, lastResponse: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate template';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      setError(errorMessage);
      throw error;
    }
  }, [setError]);

  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const isHealthy = await Chat2APIService.healthCheck();
      if (!isHealthy) {
        setError('Chat2API service is not available');
      }
      return isHealthy;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Health check failed';
      setError(errorMessage);
      return false;
    }
  }, [setError]);

  return {
    ...state,
    sendMessage,
    sendStreamingMessage,
    clearMessages,
    addMessage,
    generateWorkflowSuggestions,
    optimizeWorkflow,
    estimateWorkflowCosts,
    generateTemplateSuggestions,
    healthCheck,
  };
} 