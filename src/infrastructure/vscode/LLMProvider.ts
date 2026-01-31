// src/infrastructure/vscode/LLMProvider.ts
import axios from 'axios';
import { ILLMProvider, SendOptions } from '../../core/interfaces/ILLMProvider';

export abstract class BaseLLMProvider implements ILLMProvider {
  constructor(
    public readonly name: string,
    public readonly models: string[],
    protected baseUrl: string,
    protected apiKey?: string
  ) {}

  abstract sendMessage(message: string, options?: SendOptions): Promise<string>;
}

export class OpenAIProvider extends BaseLLMProvider {
  async sendMessage(message: string, options?: SendOptions): Promise<string> {
    const headers: any = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const messages = [
      { role: 'system', content: options?.systemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ];

    const response = await axios.post(`${this.baseUrl}/chat/completions`, {
      model: this.models[0],
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000
    }, { headers });

    return response.data.choices[0].message.content;
  }
}

export class LocalLLMProvider extends BaseLLMProvider {
  async sendMessage(message: string, options?: SendOptions): Promise<string> {
    const messages = [
      { role: 'system', content: options?.systemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ];

    const response = await axios.post(`${this.baseUrl}/chat/completions`, {
      model: this.models[0],
      messages,
      stream: false
    });

    return response.data.choices[0].message.content;
  }
}