// src/core/interfaces/ILLMProvider.ts
export interface ILLMProvider {
  readonly name: string;
  readonly models: string[];
  sendMessage(message: string, options?: SendOptions): Promise<string>;
}

export interface SendOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}