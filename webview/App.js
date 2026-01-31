import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

/* global acquireVsCodeApi */

const vscode = acquireVsCodeApi();

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [mcpData, setMcpData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [statusMessages, setStatusMessages] = useState([]);

  useEffect(() => {
    // Get providers on load
    vscode.postMessage({ command: 'getProviders' });
    vscode.postMessage({ command: 'getMCPData' });
    vscode.postMessage({ command: 'getSystemPrompt' });

    // Listen for messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'receiveMessage':
          setMessages(prev => [...prev, { sender: 'agent', text: message.text }]);
          break;
        case 'providersList':
          setProviders(message.providers);
          if (message.providers.length > 0) {
            setSelectedProvider(message.providers[0].name);
            setSelectedModel(message.providers[0].models[0]);
          }
          // Check provider statuses
          if (message.statuses) {
            const unavailableProviders = message.statuses.filter(s => !s.available);
            if (unavailableProviders.length > 0) {
              setStatusMessages(prev => [...prev, `Warning: Providers not available: ${unavailableProviders.map(s => s.name).join(', ')}`]);
            }
          }
          break;
        case 'modelSwitched':
          // Optional: Show notification
          break;
        case 'mcpData':
          // Store MCP data for autocomplete or display
          setMcpData(message.servers);
          if (!message.available) {
            setStatusMessages(prev => [...prev, `Error: MCP server not available - ${message.error || 'Connection failed'}`]);
          }
          console.log('MCP Data:', message.servers);
          break;
        case 'systemPrompt':
          setSystemPrompt(message.prompt);
          break;
        default:
          break;
      }
    });
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { sender: 'user', text: input };
      setMessages(prev => [...prev, newMessage]);
      vscode.postMessage({ command: 'sendMessage', text: input, systemPrompt: systemPrompt });
      setInput('');
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const lastAtIndex = value.lastIndexOf('@');
    const lastSlashIndex = value.lastIndexOf('/');

    if (lastAtIndex > lastSlashIndex) {
      // Autocomplete for @contexts
      const query = value.substring(lastAtIndex + 1).toLowerCase();
      const contexts = mcpData.flatMap(server => server.contexts || []);
      const filtered = contexts.filter(ctx => ctx.toLowerCase().includes(query));
      setSuggestions(filtered.map(ctx => '@' + ctx));
      setShowSuggestions(filtered.length > 0);
    } else if (lastSlashIndex > lastAtIndex) {
      // Autocomplete for /prompts
      const query = value.substring(lastSlashIndex + 1).toLowerCase();
      const prompts = mcpData.flatMap(server => server.prompts || []);
      const filtered = prompts.filter(p => p.toLowerCase().includes(query));
      setSuggestions(filtered.map(p => '/' + p));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const selected = suggestions[selectedSuggestionIndex];
          const lastAt = input.lastIndexOf('@');
          const lastSlash = input.lastIndexOf('/');
          const prefix = lastAt > lastSlash ? input.substring(0, lastAt) : input.substring(0, lastSlash);
          setInput(prefix + selected + ' ');
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleProviderChange = (e) => {
    const providerName = e.target.value;
    setSelectedProvider(providerName);
    const provider = providers.find(p => p.name === providerName);
    if (provider) {
      setSelectedModel(provider.models[0]);
      vscode.postMessage({ command: 'switchModel', provider: providerName, model: provider.models[0] });
    }
  };

  const handleModelChange = (e) => {
    const modelName = e.target.value;
    setSelectedModel(modelName);
    vscode.postMessage({ command: 'switchModel', provider: selectedProvider, model: modelName });
  };

  const currentProviderObj = providers.find(p => p.name === selectedProvider);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--vscode-font-family)', backgroundColor: 'var(--vscode-editor-background)', color: 'var(--vscode-editor-foreground)' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid var(--vscode-input-border)', display: 'flex', gap: '10px' }}>
        <select value={selectedProvider} onChange={handleProviderChange} style={{ padding: '4px', backgroundColor: 'var(--vscode-input-background)', color: 'var(--vscode-input-foreground)' }}>
          {providers.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        {currentProviderObj && (
          <select value={selectedModel} onChange={handleModelChange} style={{ padding: '4px', backgroundColor: 'var(--vscode-input-background)', color: 'var(--vscode-input-foreground)' }}>
            {currentProviderObj.models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
      </div>
      <div style={{ padding: '10px', borderBottom: '1px solid var(--vscode-input-border)' }}>
        <label>System Prompt:</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter system prompt..."
          style={{
            width: '100%',
            height: '60px',
            padding: '4px',
            backgroundColor: 'var(--vscode-input-background)',
            color: 'var(--vscode-input-foreground)',
            border: '1px solid var(--vscode-input-border)',
            resize: 'vertical'
          }}
        />
      </div>
      {statusMessages.length > 0 && (
        <div style={{ padding: '10px', borderBottom: '1px solid var(--vscode-input-border)', backgroundColor: 'var(--vscode-notificationsWarningIcon-foreground)', color: 'var(--vscode-editor-background)' }}>
          {statusMessages.map((msg, index) => (
            <div key={index} style={{ margin: '2px 0' }}>{msg}</div>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            margin: '5px 0',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: msg.sender === 'user' ? 'var(--vscode-button-background)' : 'var(--vscode-input-background)',
            color: msg.sender === 'user' ? 'var(--vscode-button-foreground)' : 'var(--vscode-input-foreground)',
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid var(--vscode-input-border)' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid var(--vscode-input-border)',
              backgroundColor: 'var(--vscode-input-background)',
              color: 'var(--vscode-input-foreground)'
            }}
          />
          {showSuggestions && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--vscode-quickInput-background)',
              border: '1px solid var(--vscode-input-border)',
              borderTop: 'none',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const lastAt = input.lastIndexOf('@');
                    const lastSlash = input.lastIndexOf('/');
                    const prefix = lastAt > lastSlash ? input.substring(0, lastAt) : input.substring(0, lastSlash);
                    setInput(prefix + suggestion + ' ');
                    setShowSuggestions(false);
                    setSelectedSuggestionIndex(-1);
                  }}
                  style={{
                    padding: '4px 8px',
                    cursor: 'pointer',
                    backgroundColor: index === selectedSuggestionIndex ? 'var(--vscode-list-activeSelectionBackground)' : 'transparent',
                    color: index === selectedSuggestionIndex ? 'var(--vscode-list-activeSelectionForeground)' : 'var(--vscode-foreground)'
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={sendMessage} style={{
          padding: '8px 16px',
          marginLeft: '10px',
          backgroundColor: 'var(--vscode-button-background)',
          color: 'var(--vscode-button-foreground)',
          border: 'none',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);