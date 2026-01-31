import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import axios from 'axios';
import { currentProvider, currentModel, switchProvider, getAvailableProviders, initializeProviders } from './providers';
import { initializeIntegrations, defaultMCPServers, queryRAG } from './integrations';

export function activate(context: vscode.ExtensionContext) {
  console.log('Agent Chat Misc extension is now active!');

  // Load config
  const configPath = path.join(context.extensionPath, 'config.json');
  let config: any = {};
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configData);
  } catch (error) {
    console.error('Failed to load config:', error);
  }

  // Make config global for use in functions
  (global as any).extensionConfig = config;

  // Start HTTP server for API endpoints
  const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/chat') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { message, systemPrompt } = JSON.parse(body);
          const reply = await handleAPIChat(message, systemPrompt);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply }));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });

  const port = 3001; // Choose a port
  server.listen(port, () => {
    console.log(`Agent Chat API server listening on port ${port}`);
  });

  context.subscriptions.push({
    dispose: () => {
      server.close();
    }
  });

  // Initialize integrations
  initializeIntegrations(config);

  // Initialize providers
  initializeProviders(config);

  // Register the command to open the chat
  const disposable = vscode.commands.registerCommand('agentChat.openChat', () => {
    // Create a webview panel for the chat GUI
    const panel = vscode.window.createWebviewPanel(
      'agentChat',
      'Agent Chat',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview')]
      }
    );

    // Set the HTML content for the webview (placeholder for now)
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'sendMessage':
            await handleSendMessage(panel.webview, message.text, message.systemPrompt);
            break;
          case 'switchModel':
            switchProvider(message.provider, message.model);
            panel.webview.postMessage({ command: 'modelSwitched', provider: message.provider, model: message.model });
            break;
          case 'getProviders':
            panel.webview.postMessage({ command: 'providersList', providers: getAvailableProviders() });
            break;
          case 'getMCPData':
            panel.webview.postMessage({ command: 'mcpData', servers: defaultMCPServers });
            break;
          case 'getSystemPrompt':
            panel.webview.postMessage({ command: 'systemPrompt', prompt: config.systemPrompt });
            break;
          default:
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  // Register the command to open settings
  const settingsDisposable = vscode.commands.registerCommand('agentChat.openSettings', () => {
    // Create a webview panel for settings
    const panel = vscode.window.createWebviewPanel(
      'agentChatSettings',
      'Agent Chat Settings',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview')]
      }
    );

    // Set the HTML content for the settings webview
    panel.webview.html = getSettingsWebviewContent(panel.webview, context.extensionUri, config);

    // Handle messages from the settings webview
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'saveConfig':
            try {
              fs.writeFileSync(configPath, JSON.stringify(message.config, null, 2));
              config = message.config;
              vscode.window.showInformationMessage('Settings saved successfully!');
            } catch (error) {
              vscode.window.showErrorMessage('Failed to save settings.');
              console.error(error);
            }
            break;
          default:
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable, settingsDisposable);
}

async function handleSendMessage(webview: vscode.Webview, text: string, systemPrompt?: string) {
  try {
    // Optional: Query RAG for context
    const ragContext = await queryRAG(text);
    const enhancedText = ragContext ? `${text}\n\nContext: ${ragContext}` : text;

    const config = (global as any).extensionConfig;
    const prompt = systemPrompt || config.systemPrompt || 'You are a helpful AI assistant.';

    const headers: any = {};
    if (currentProvider.apiKey) {
      headers['Authorization'] = `Bearer ${currentProvider.apiKey}`;
    }

    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: enhancedText }
    ];

    const response = await axios.post(`${currentProvider.baseUrl}/chat/completions`, {
      model: currentModel,
      messages: messages,
      stream: false
    }, { headers });

    const reply = response.data.choices[0].message.content;
    webview.postMessage({ command: 'receiveMessage', text: reply });
  } catch (error) {
    vscode.window.showErrorMessage('Error communicating with backend: ' + (error as Error).message);
    webview.postMessage({ command: 'receiveMessage', text: 'Error: Could not get response from LLM.' });
  }
}

async function handleAPIChat(text: string, systemPrompt?: string): Promise<string> {
  try {
    // Optional: Query RAG for context
    const ragContext = await queryRAG(text);
    const enhancedText = ragContext ? `${text}\n\nContext: ${ragContext}` : text;

    const config = (global as any).extensionConfig;
    const prompt = systemPrompt || config.systemPrompt || 'You are a helpful AI assistant.';

    const headers: any = {};
    if (currentProvider.apiKey) {
      headers['Authorization'] = `Bearer ${currentProvider.apiKey}`;
    }

    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: enhancedText }
    ];

    const response = await axios.post(`${currentProvider.baseUrl}/chat/completions`, {
      model: currentModel,
      messages: messages,
      stream: false
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('Could not get response from LLM.');
  }
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const appUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'webview', 'App.js'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Chat</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel" src="${appUri}"></script>
</body>
</html>`;
}

function getSettingsWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, config: any): string {
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
    </script>
</body>
</html>`;
}

export function deactivate() {}