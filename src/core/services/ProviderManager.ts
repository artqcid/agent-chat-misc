// src/core/services/ProviderManager.ts
import { ILLMProvider } from '../interfaces/ILLMProvider';
import { IConfigService } from '../interfaces/IConfigService';
import { ProviderConfig } from '../types/Config';
import { OpenAIProvider, LocalLLMProvider } from '../../infrastructure/vscode/LLMProvider';
import axios from 'axios';

export class ProviderManager {
  private providers: ILLMProvider[] = [];
  private currentProvider: ILLMProvider | null = null;
  private currentModel: string = '';

  constructor(private configService: IConfigService) {}

  async initialize(): Promise<void> {
    const providerConfigs: ProviderConfig[] = this.configService.get('providers');
    this.providers = providerConfigs.map(config => this.createProvider(config));
    if (this.providers.length > 0) {
      this.currentProvider = this.providers[0];
      this.currentModel = this.providers[0].models[0];
    }
  }

  private createProvider(config: ProviderConfig): ILLMProvider {
    if (config.url.includes('openai.com')) {
      return new OpenAIProvider(config.name, config.models, config.url, config.apiKey);
    } else {
      return new LocalLLMProvider(config.name, config.models, config.url);
    }
  }

  async testProviderConnectivity(providerName: string): Promise<boolean> {
    const provider = this.providers.find(p => p.name === providerName);
    if (!provider) return false;

    try {
      // Simple connectivity test - try to send a minimal request
      await provider.sendMessage('test', { systemPrompt: 'test' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getProviderStatus(): Promise<{ name: string; available: boolean }[]> {
    const statuses = await Promise.all(
      this.providers.map(async (provider) => ({
        name: provider.name,
        available: await this.testProviderConnectivity(provider.name)
      }))
    );
    return statuses;
  }

  switchProvider(providerName: string, modelName: string): void {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider && provider.models.includes(modelName)) {
      this.currentProvider = provider;
      this.currentModel = modelName;
    }
  }

  getAvailableProviders(): { name: string; models: string[] }[] {
    return this.providers.map(p => ({ name: p.name, models: p.models }));
  }

  async sendMessage(message: string, options?: { systemPrompt?: string }): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No provider available');
    }
    return this.currentProvider.sendMessage(message, options);
  }
}