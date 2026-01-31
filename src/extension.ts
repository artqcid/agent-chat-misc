import * as vscode from 'vscode';
import { Container } from './di/Container';
import { IConfigService } from './core/interfaces/IConfigService';
import { IChatService } from './core/interfaces/IChatService';
import { VSCodeConfigService } from './infrastructure/storage/VSCodeConfigService';
import { ChatService } from './core/services/ChatService';
import { ProviderManager } from './core/services/ProviderManager';
import { HttpApiService } from './infrastructure/http/HttpApiService';
import { WebViewController } from './ui/controllers/WebViewController';
import { SettingsWebViewController } from './ui/controllers/SettingsWebViewController';
import { COMMANDS } from './shared/constants/commands';

let webviewPanel: vscode.WebviewPanel | undefined;
let settingsPanel: vscode.WebviewPanel | undefined;

export async function activate(context: vscode.ExtensionContext) {
  console.log('Agent Chat Misc extension is now active!');

  // Initialize dependency injection container
  const container = new Container();

  // Register infrastructure services
  container.register<IConfigService>('IConfigService', () => new VSCodeConfigService(context));

  // Initialize config service
  const configService = container.resolve<IConfigService>('IConfigService');
  await configService.load();

  // Register core services
  container.register<ProviderManager>('ProviderManager', () => new ProviderManager(configService));
  container.register<IChatService>('IChatService', () => new ChatService(container.resolve<ProviderManager>('ProviderManager')));

  // Register UI controllers
  container.register<WebViewController>('WebViewController', () =>
    new WebViewController(
      container.resolve<IChatService>('IChatService'),
      container.resolve<ProviderManager>('ProviderManager'),
      configService
    )
  );
  container.register<SettingsWebViewController>('SettingsWebViewController', () =>
    new SettingsWebViewController(configService)
  );

  // Register infrastructure services
  container.register<HttpApiService>('HttpApiService', () =>
    new HttpApiService(container.resolve<IChatService>('IChatService'))
  );

  // Initialize services
  const providerManager = container.resolve<ProviderManager>('ProviderManager');
  await providerManager.initialize();

  const httpApiService = container.resolve<HttpApiService>('HttpApiService');
  httpApiService.start(3001);

  // Register commands
  const openChatCommand = vscode.commands.registerCommand(COMMANDS.OPEN_CHAT, () => {
    createChatWebview(context, container);
  });

  const openSettingsCommand = vscode.commands.registerCommand(COMMANDS.OPEN_SETTINGS, () => {
    createSettingsWebview(context, container);
  });

  context.subscriptions.push(openChatCommand, openSettingsCommand, {
    dispose: () => {
      httpApiService.stop();
      webviewPanel?.dispose();
      settingsPanel?.dispose();
    }
  });
}

function createChatWebview(context: vscode.ExtensionContext, container: Container) {
  if (webviewPanel) {
    webviewPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  webviewPanel = vscode.window.createWebviewPanel(
    'agentChat',
    'Agent Chat',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview')]
    }
  );

  webviewPanel.webview.html = getWebviewContent(webviewPanel.webview, context.extensionUri);

  const webViewController = container.resolve<WebViewController>('WebViewController');

  webviewPanel.webview.onDidReceiveMessage(
    async message => {
      await webViewController.handleMessage(webviewPanel!.webview, message);
    },
    undefined,
    context.subscriptions
  );

  webviewPanel.onDidDispose(() => {
    webviewPanel = undefined;
  });
}

function createSettingsWebview(context: vscode.ExtensionContext, container: Container) {
  if (settingsPanel) {
    settingsPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  settingsPanel = vscode.window.createWebviewPanel(
    'agentChatSettings',
    'Agent Chat Settings',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'webview')]
    }
  );

  const settingsController = container.resolve<SettingsWebViewController>('SettingsWebViewController');
  settingsPanel.webview.html = settingsController.getSettingsContent();

  settingsPanel.webview.onDidReceiveMessage(
    async message => {
      await settingsController.handleMessage(settingsPanel!.webview, message);
    },
    undefined,
    context.subscriptions
  );

  settingsPanel.onDidDispose(() => {
    settingsPanel = undefined;
  });
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