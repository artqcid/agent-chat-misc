// src/core/types/Config.ts
export interface ProviderConfig {
  name: string;
  url: string;
  models: string[];
  apiKey?: string;
}

export interface MCPServerConfig {
  name: string;
  url: string;
}

export interface ExtensionConfig {
  providers: ProviderConfig[];
  mcpServers: MCPServerConfig[];
  systemPrompt: string;
}