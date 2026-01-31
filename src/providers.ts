// Provider management for LLM models
export interface LLMProvider {
  name: string;
  type: 'local' | 'remote';
  baseUrl: string;
  models: string[];
  apiKey?: string;
}

let providers: LLMProvider[] = [];
export let currentProvider: LLMProvider;
export let currentModel: string;

export function initializeProviders(config: any) {
  providers = config.providers.map((p: any) => ({
    name: p.name,
    type: p.url.startsWith('http://localhost') ? 'local' : 'remote',
    baseUrl: p.url,
    models: p.models,
    apiKey: p.apiKey || ''
  }));
  if (providers.length > 0) {
    currentProvider = providers[0];
    currentModel = providers[0].models[0];
  }
}

export function switchProvider(providerName: string, modelName: string) {
  const provider = providers.find(p => p.name === providerName);
  if (provider && provider.models.includes(modelName)) {
    currentProvider = provider;
    currentModel = modelName;
    // Note: Context loss for new model, but chat history preserved in UI
  }
}

export function getAvailableProviders(): LLMProvider[] {
  return providers;
}