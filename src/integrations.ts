// Integrations for MCP, RAG, and Embedding servers
import axios from 'axios';

export interface MCPServer {
  name: string;
  url: string;
  prompts: string[];
  contexts: string[];
}

export interface RAGServer {
  name: string;
  url: string;
}

export interface EmbeddingServer {
  name: string;
  url: string;
}

let mcpServers: MCPServer[] = [];
export let defaultRAGServer: RAGServer;
export let defaultEmbeddingServer: EmbeddingServer;

export const defaultMCPServers = mcpServers;

export async function fetchMCPData(server: MCPServer) {
  try {
    // Assume MCP server has endpoints for prompts and contexts
    const promptsRes = await axios.get(`${server.url}/prompts`);
    const contextsRes = await axios.get(`${server.url}/contexts`);
    server.prompts = promptsRes.data;
    server.contexts = contextsRes.data;
  } catch (error) {
    console.error('Error fetching MCP data:', error);
  }
}

export async function queryRAG(query: string): Promise<string> {
  try {
    const response = await axios.post(`${defaultRAGServer.url}/query`, { query });
    return response.data.result;
  } catch (error) {
    return 'RAG query failed';
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(`${defaultEmbeddingServer.url}/embed`, { text });
    return response.data.embedding;
  } catch (error) {
    return [];
  }
}

// Initialize MCP data on startup
export function initializeIntegrations(config: any) {
  mcpServers = config.mcpServers.map((s: any) => ({
    name: s.name,
    url: s.url,
    prompts: [],
    contexts: []
  }));
  defaultRAGServer = {
    name: 'RAG Server',
    url: config.mcpServers.find((s: any) => s.name === 'RAG Server')?.url || 'http://localhost:8000'
  };
  defaultEmbeddingServer = {
    name: 'Embedding Server',
    url: config.mcpServers.find((s: any) => s.name === 'Embedding Server')?.url || 'http://localhost:5000'
  };
  // Fetch MCP data
  for (const server of mcpServers) {
    fetchMCPData(server);
  }
}