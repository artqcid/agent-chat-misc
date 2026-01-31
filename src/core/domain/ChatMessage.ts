// src/core/domain/ChatMessage.ts
export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly role: 'user' | 'assistant',
    public readonly timestamp: Date
  ) {}
}