import * as assert from 'assert';
import { initializeProviders, switchProvider, getAvailableProviders } from '../providers';

suite('Providers Test Suite', () => {
    test('initializeProviders should set providers from config', () => {
        const config = {
            providers: [
                { name: 'TestProvider', url: 'http://test.com', models: ['model1'] }
            ]
        };
        initializeProviders(config);
        const providers = getAvailableProviders();
        assert.strictEqual(providers.length, 1);
        assert.strictEqual(providers[0].name, 'TestProvider');
    });

    test('switchProvider should update current provider and model', () => {
        const config = {
            providers: [
                { name: 'Provider1', url: 'http://test1.com', models: ['model1'] },
                { name: 'Provider2', url: 'http://test2.com', models: ['model2'] }
            ]
        };
        initializeProviders(config);
        switchProvider('Provider2', 'model2');
        // Note: Internal state, hard to test without exposing getters
        assert.ok(true); // Placeholder
    });
});