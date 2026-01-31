// src/infrastructure/storage/VSCodeConfigService.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IConfigService } from '../../core/interfaces/IConfigService';
import { ExtensionConfig } from '../../core/types/Config';

export class VSCodeConfigService implements IConfigService {
  private config: ExtensionConfig | null = null;
  private readonly configPath: string;

  constructor(private context: vscode.ExtensionContext) {
    this.configPath = path.join(context.extensionPath, 'config.json');
  }

  async load(): Promise<void> {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error('Failed to load config:', error);
      this.config = this.getDefaultConfig();
    }
  }

  get<T>(key: string): T {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    return (this.config as any)[key];
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!this.config) {
      throw new Error('Config not loaded');
    }
    (this.config as any)[key] = value;
    await this.save();
  }

  async save(): Promise<void> {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new Error('Failed to save config');
    }
  }

  private getDefaultConfig(): ExtensionConfig {
    return {
      providers: [
        {
          name: 'Llama.cpp',
          url: 'http://localhost:8080',
          models: ['qwen2.5-7b']
        }
      ],
      mcpServers: [
        {
          name: 'MCP Server Misc',
          url: 'http://localhost:3000'
        }
      ],
      systemPrompt: 'You are a helpful AI assistant.'
    };
  }
}