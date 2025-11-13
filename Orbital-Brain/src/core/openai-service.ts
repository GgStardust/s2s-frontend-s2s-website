/**
 * Shared OpenAI Service
 * 
 * Centralized OpenAI API service for use across CMS_Backend and other systems.
 * Reads API key from environment variables.
 * 
 * This service should be used instead of creating OpenAI instances directly.
 */

import OpenAI from 'openai';

export class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI | null = null;

  private constructor() {
    // Initialize client lazily to avoid issues if env var not set
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  /**
   * Get OpenAI client instance
   * Reads API key from OPENAI_API_KEY environment variable
   */
  public getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error(
          'OPENAI_API_KEY environment variable is not set. ' +
          'Please set it in your .env file or environment variables.'
        );
      }

      this.client = new OpenAI({
        apiKey: apiKey,
      });
    }

    return this.client;
  }

  /**
   * Chat completions - Main method for conversation
   */
  public async chatCompletions(params: {
    model?: string;
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: 'json_object' | 'text' };
  }): Promise<string> {
    const client = this.getClient();
    
    const response = await client.chat.completions.create({
      model: params.model || 'gpt-4o',
      messages: params.messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 2000,
      response_format: params.response_format,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Embeddings - For semantic search and vector similarity
   */
  public async createEmbedding(text: string, model: string = 'text-embedding-3-small'): Promise<number[]> {
    const client = this.getClient();
    
    const response = await client.embeddings.create({
      model: model,
      input: text,
    });

    return response.data[0]?.embedding || [];
  }

  /**
   * Chat completions with JSON response
   */
  public async chatCompletionsJSON<T = any>(params: {
    model?: string;
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    temperature?: number;
    max_tokens?: number;
  }): Promise<T> {
    const response = await this.chatCompletions({
      ...params,
      response_format: { type: 'json_object' },
    });

    try {
      return JSON.parse(response) as T;
    } catch (error) {
      throw new Error(`Failed to parse JSON response from OpenAI: ${error}`);
    }
  }

  /**
   * Check if API key is configured
   */
  public isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }
}

// Export singleton instance
export const openAIService = OpenAIService.getInstance();

// Export convenience functions
export async function chatCompletions(params: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}): Promise<string> {
  return openAIService.chatCompletions(params);
}

export async function createEmbedding(text: string, model?: string): Promise<number[]> {
  return openAIService.createEmbedding(text, model);
}

export async function chatCompletionsJSON<T = any>(params: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}): Promise<T> {
  return openAIService.chatCompletionsJSON<T>(params);
}

