// src/core/interfaces/IChatService.ts
export interface IChatService {
  sendMessage(message: string, systemPrompt?: string): Promise<string>;
}