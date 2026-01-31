// Provider management for LLM models
export interface LLMProvider {
  name: string;
  type: 'local' | 'remote';
  baseUrl: string;
  models: string[];
  apiKey?: string;
}

export const defaultProviders: LLMProvider[] = [
  {
    name: 'Qwen Training Llama.cpp',
    type: 'local',
    baseUrl: 'http://localhost:8080/v1',
    models: ['qwen']
  },
  {
    name: 'Ollama',
    type: 'local',
    baseUrl: 'http://localhost:11434/v1',
    models: ['llama2', 'mistral']
  },
  {
    name: 'OpenAI',
    type: 'remote',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4'],
    apiKey: process.env.OPENAI_API_KEY
  }
];

export let currentProvider: LLMProvider = defaultProviders[0];
export let currentModel: string = currentProvider.models[0];

export function switchProvider(providerName: string, modelName: string) {
  const provider = defaultProviders.find(p => p.name === providerName);
  if (provider && provider.models.includes(modelName)) {
    currentProvider = provider;
    currentModel = modelName;
    // Note: Context loss for new model, but chat history preserved in UI
  }
}

export function getAvailableProviders(): LLMProvider[] {
  return defaultProviders;
}