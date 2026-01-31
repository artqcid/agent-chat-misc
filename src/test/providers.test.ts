import * as assert from 'assert';
import { ProviderManager } from '../core/services/ProviderManager';
import { VSCodeConfigService } from '../infrastructure/storage/VSCodeConfigService';
import * as vscode from 'vscode';

suite('ProviderManager Test Suite', () => {
    test('initialize should set providers from config', async () => {
        // Mock VSCode context
        const mockContext = {
            extensionPath: '/test',
            globalState: {
                get: () => ({}),
                update: () => Promise.resolve()
            }
        } as any;

        const configService = new VSCodeConfigService(mockContext);
        // Mock config
        (configService as any).config = {
            providers: [
                { name: 'TestProvider', url: 'http://test.com', models: ['model1'] }
            ]
        };

        const providerManager = new ProviderManager(configService);
        await providerManager.initialize();

        const providers = providerManager.getAvailableProviders();
        assert.strictEqual(providers.length, 1);
        assert.strictEqual(providers[0].name, 'TestProvider');
    });
});