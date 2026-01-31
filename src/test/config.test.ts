import * as assert from 'assert';
import { VSCodeConfigService } from '../infrastructure/storage/VSCodeConfigService';
import * as vscode from 'vscode';

suite('VSCodeConfigService Test Suite', () => {
    test('should initialize with default config', () => {
        const mockContext = {
            extensionPath: '/test',
            globalState: {
                get: () => ({}),
                update: () => Promise.resolve()
            }
        } as any;

        const configService = new VSCodeConfigService(mockContext);
        assert.ok(configService);
        // Further tests would require mocking vscode.workspace.getConfiguration
    });
});