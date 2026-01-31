# Agent Chat Misc Extension

A VS Code extension that provides a chat agent with a GUI similar to GitHub Copilot, supporting local and remote LLMs, MCP, RAG, and Embedding integration.

## Features

- Chat interface mimicking GitHub Copilot
- Support for local (Llama.cpp, Ollama) and remote (OpenAI) LLM providers
- Model switching with preserved chat history
- MCP (Model Context Protocol) integration for dynamic contexts and prompts
- RAG (Retrieval-Augmented Generation) for enhanced responses
- Embedding server integration
- Configurable system prompts via UI and JSON config
- Context and prompt management with @contexts and /prompts autocomplete
- JSON-based settings editor
- REST API endpoints for external integrations

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Open in VS Code and press F5 to run in debug mode

## Usage

### Chat Interface

- Open the chat: `Ctrl+Shift+P` > "Agent Chat: Open Agent Chat"
- Select provider and model from dropdowns
- Edit system prompt in the textarea
- Type messages with @contexts or /prompts for autocomplete
- Send messages and receive AI responses

### Settings

- Open settings: `Ctrl+Shift+P` > "Agent Chat: Open Agent Chat Settings"
- Edit JSON configuration for providers, MCP servers, and system prompt
- Save changes

### API Usage

The extension provides a REST API on port 3001:

- POST /chat
  - Body: `{ "message": "Hello", "systemPrompt": "Optional prompt" }`
  - Response: `{ "reply": "AI response" }`

## Configuration

Edit `config.json` in the extension root:

```json
{
  "providers": [
    {
      "name": "Llama.cpp",
      "url": "http://localhost:8080",
      "models": ["qwen2.5-7b"]
    }
  ],
  "mcpServers": [
    {
      "name": "MCP Server Misc",
      "url": "http://localhost:3000"
    }
  ],
  "systemPrompt": "You are a helpful AI assistant."
}
```

## Development

1. Install dependencies: `npm install`
2. Compile: `npm run compile`
3. Watch for changes: `npm run watch`
4. Run tests: `npm test`
5. Lint: `npm run lint`

## Testing

Run unit tests with `npm test`. Tests cover providers and integrations.

## Architecture

- `src/extension.ts`: Main extension logic, webview management, API server
- `src/providers.ts`: LLM provider management
- `src/integrations.ts`: MCP/RAG/Embedding integrations
- `webview/App.js`: React-based chat UI
- `config.json`: Configuration file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## License

MIT