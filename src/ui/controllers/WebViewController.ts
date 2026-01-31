// src/ui/controllers/WebViewController.ts
import * as vscode from 'vscode';
import { IChatService } from '../../core/interfaces/IChatService';
import { ProviderManager } from '../../core/services/ProviderManager';
import { IConfigService } from '../../core/interfaces/IConfigService';
import axios from 'axios';

export class WebViewController {
  constructor(
    private chatService: IChatService,
    private providerManager: ProviderManager,
    private configService: IConfigService
  ) {}

  async handleMessage(webview: vscode.Webview, message: any): Promise<void> {
    switch (message.command) {
      case 'sendMessage':
        try {
          const reply = await this.chatService.sendMessage(message.text, message.systemPrompt);
          webview.postMessage({ command: 'receiveMessage', text: reply });
        } catch (error) {
          webview.postMessage({ command: 'receiveMessage', text: 'Error: Could not get response from LLM. Please check provider configuration.' });
        }
        break;
      case 'switchModel':
        this.providerManager.switchProvider(message.provider, message.model);
        webview.postMessage({ command: 'modelSwitched', provider: message.provider, model: message.model });
        break;
      case 'getProviders': {
        const providers = this.providerManager.getAvailableProviders();
        const providerStatuses = await this.providerManager.getProviderStatus();
        webview.postMessage({ command: 'providersList', providers, statuses: providerStatuses });
        break;
      }
      case 'getMCPData':
        await this.sendMCPData(webview);
        break;
      case 'getSystemPrompt':
        webview.postMessage({ command: 'systemPrompt', prompt: this.configService.get<string>('systemPrompt') });
        break;
      default:
        break;
    }
  }

  private async sendMCPData(webview: vscode.Webview): Promise<void> {
    try {
      // Assume MCP server is running on localhost:3000 or from config
      const mcpServerUrl = this.configService.get<string>('mcpServerUrl') || 'http://localhost:3000';
      const response = await axios.get(`${mcpServerUrl}/mcp/data`);
      webview.postMessage({ command: 'mcpData', servers: response.data, available: true });
    } catch (error) {
      webview.postMessage({ command: 'mcpData', servers: [], available: false, error: 'MCP server not available' });
    }
  }
}