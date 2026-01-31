import * as assert from 'assert';
import { Container } from '../di/Container';
import { VSCodeConfigService } from '../infrastructure/storage/VSCodeConfigService';
import * as vscode from 'vscode';

suite('Container Test Suite', () => {
    test('should register and resolve services', () => {
        const container = new Container();

        const mockContext = {
            extensionPath: '/test',
            globalState: {
                get: () => ({}),
                update: () => Promise.resolve()
            }
        } as any;

        container.register('IConfigService', () => new VSCodeConfigService(mockContext));

        const configService = container.resolve('IConfigService');
        assert.ok(configService instanceof VSCodeConfigService);
    });
});