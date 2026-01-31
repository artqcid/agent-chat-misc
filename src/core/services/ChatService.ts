// src/core/services/ChatService.ts
import { IChatService } from '../interfaces/IChatService';
import { ProviderManager } from './ProviderManager';

export class ChatService implements IChatService {
  constructor(private providerManager: ProviderManager) {}

  async sendMessage(message: string, systemPrompt?: string): Promise<string> {
    // Here we could add RAG enhancement, but keeping it simple for now
    return this.providerManager.sendMessage(message, { systemPrompt });
  }
}