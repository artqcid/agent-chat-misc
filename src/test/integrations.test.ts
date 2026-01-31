import * as assert from 'assert';
import { ChatService } from '../core/services/ChatService';
import { VSCodeConfigService } from '../infrastructure/storage/VSCodeConfigService';
import { HttpApiService } from '../infrastructure/http/HttpApiService';
import { ProviderManager } from '../core/services/ProviderManager';
import * as vscode from 'vscode';

suite('ChatService Test Suite', () => {
    test('sendMessage should call provider and return response', async () => {
        // Mock VSCode context
        const mockContext = {
            extensionPath: '/test',
            globalState: {
                get: () => ({}),
                update: () => Promise.resolve()
            }
        } as any;

        const configService = new VSCodeConfigService(mockContext);
        const httpService = new HttpApiService(null as any); // Mock chatService
        const providerManager = new ProviderManager(configService);

        // Mock config
        (configService as any).config = {
            providers: [
                { name: 'TestProvider', url: 'http://test.com', models: ['model1'] }
            ]
        };

        await providerManager.initialize();

        const chatService = new ChatService(providerManager);

        // Mock provider
        const mockProvider = {
            sendMessage: async () => 'Test response'
        };
        (providerManager as any).currentProvider = mockProvider;

        const response = await chatService.sendMessage('Test message');
        assert.strictEqual(response, 'Test response');
    });
});