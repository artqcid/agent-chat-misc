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

export const defaultMCPServers: MCPServer[] = [
  {
    name: 'MCP Server Misc',
    url: 'http://localhost:3000', // Adjust port
    prompts: [],
    contexts: []
  }
];

export const defaultRAGServer: RAGServer = {
  name: 'RAG Server',
  url: 'http://localhost:8002' // Adjust port
};

export const defaultEmbeddingServer: EmbeddingServer = {
  name: 'Embedding Server',
  url: 'http://localhost:8001' // Adjust port
};

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
export async function initializeIntegrations() {
  for (const server of defaultMCPServers) {
    await fetchMCPData(server);
  }
}