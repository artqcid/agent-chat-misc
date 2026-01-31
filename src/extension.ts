import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Agent Chat Misc extension is now active!');

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
      message => {
        switch (message.command) {
          case 'sendMessage':
            // Handle chat message
            vscode.window.showInformationMessage(`Message: ${message.text}`);
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

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'webview', 'main.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'webview', 'style.css'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Chat</title>
    <link href="${styleUri}" rel="stylesheet">
</head>
<body>
    <div id="chat-container">
        <div id="messages"></div>
        <input type="text" id="input" placeholder="Type your message...">
        <button id="send">Send</button>
    </div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate() {}