// src/ui/controllers/SettingsWebViewController.ts
import * as vscode from 'vscode';
import { IConfigService } from '../../core/interfaces/IConfigService';
import { ExtensionConfig } from '../../core/types/Config';

export class SettingsWebViewController {
  constructor(private configService: IConfigService) {}

  async handleMessage(webview: vscode.Webview, message: any): Promise<void> {
    switch (message.command) {
      case 'saveConfig':
        try {
          await this.configService.set('providers', message.config.providers);
          await this.configService.set('mcpServers', message.config.mcpServers);
          await this.configService.set('systemPrompt', message.config.systemPrompt);
          await this.configService.save();
          vscode.window.showInformationMessage('Settings saved successfully!');
        } catch (error) {
          vscode.window.showErrorMessage('Failed to save settings.');
          console.error(error);
        }
        break;
      case 'reloadConfig':
        try {
          await this.configService.load();
          // Test connections here if needed
          vscode.window.showInformationMessage('Configuration reloaded successfully!');
          // Send updated config back to webview
          webview.postMessage({ command: 'configReloaded', config: {
            providers: this.configService.get('providers'),
            mcpServers: this.configService.get('mcpServers'),
            systemPrompt: this.configService.get('systemPrompt')
          }});
        } catch (error) {
          vscode.window.showErrorMessage('Failed to reload configuration.');
          console.error(error);
        }
        break;
      default:
        break;
    }
  }

  getSettingsContent(): string {
    const config = {
      providers: this.configService.get('providers'),
      mcpServers: this.configService.get('mcpServers'),
      systemPrompt: this.configService.get('systemPrompt')
    };

    const configJson = JSON.stringify(config, null, 2);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Chat Settings</title>
    <style>
      body { font-family: var(--vscode-font-family); background-color: var(--vscode-editor-background); color: var(--vscode-editor-foreground); padding: 20px; }
      textarea { width: 100%; height: 400px; background-color: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 8px; font-family: monospace; }
      button { background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 8px 16px; cursor: pointer; margin-top: 10px; }
    </style>
</head>
<body>
    <h2>Agent Chat Settings</h2>
    <textarea id="configEditor">${configJson.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
    <br>
    <button onclick="saveConfig()">Save Settings</button>
    <button onclick="reloadConfig()">Reload Configuration</button>
    <script>
      const vscode = acquireVsCodeApi();
      function saveConfig() {
        const configText = document.getElementById('configEditor').value;
        try {
          const config = JSON.parse(configText);
          vscode.postMessage({ command: 'saveConfig', config: config });
        } catch (error) {
          alert('Invalid JSON: ' + error.message);
        }
      }
      function reloadConfig() {
        vscode.postMessage({ command: 'reloadConfig' });
      }
      // Listen for config reload response
      window.addEventListener('message', event => {
        const message = event.data;
        if (message.command === 'configReloaded') {
          document.getElementById('configEditor').value = JSON.stringify(message.config, null, 2);
          alert('Configuration reloaded successfully!');
        }
      });
    </script>
</body>
</html>`;
  }
}