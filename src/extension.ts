import * as vscode from 'vscode';
import axios from 'axios';
import { currentProvider, currentModel, switchProvider, getAvailableProviders } from './providers';
import { initializeIntegrations, defaultMCPServers, queryRAG } from './integrations';

export function activate(context: vscode.ExtensionContext) {
  console.log('Agent Chat Misc extension is now active!');

  // Initialize integrations
  initializeIntegrations();

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
            await handleSendMessage(panel.webview, message.text);
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
          default:
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

async function handleSendMessage(webview: vscode.Webview, text: string) {
  try {
    // Optional: Query RAG for context
    const ragContext = await queryRAG(text);
    const enhancedText = ragContext ? `${text}\n\nContext: ${ragContext}` : text;

    const headers: any = {};
    if (currentProvider.apiKey) {
      headers['Authorization'] = `Bearer ${currentProvider.apiKey}`;
    }

    const response = await axios.post(`${currentProvider.baseUrl}/chat/completions`, {
      model: currentModel,
      messages: [{ role: 'user', content: enhancedText }],
      stream: false
    }, { headers });

    const reply = response.data.choices[0].message.content;
    webview.postMessage({ command: 'receiveMessage', text: reply });
  } catch (error) {
    vscode.window.showErrorMessage('Error communicating with backend: ' + (error as Error).message);
    webview.postMessage({ command: 'receiveMessage', text: 'Error: Could not get response from LLM.' });
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

export function deactivate() {}