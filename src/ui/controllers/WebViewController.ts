// src/ui/controllers/WebViewController.ts
import * as vscode from 'vscode';
import { IChatService } from '../../core/interfaces/IChatService';
import { ProviderManager } from '../../core/services/ProviderManager';
import { IConfigService } from '../../core/interfaces/IConfigService';

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
          webview.postMessage({ command: 'receiveMessage', text: 'Error: Could not get response from LLM.' });
        }
        break;
      case 'switchModel':
        this.providerManager.switchProvider(message.provider, message.model);
        webview.postMessage({ command: 'modelSwitched', provider: message.provider, model: message.model });
        break;
      case 'getProviders':
        webview.postMessage({ command: 'providersList', providers: this.providerManager.getAvailableProviders() });
        break;
      case 'getSystemPrompt':
        webview.postMessage({ command: 'systemPrompt', prompt: this.configService.get<string>('systemPrompt') });
        break;
      default:
        break;
    }
  }
}