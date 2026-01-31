import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const vscode = acquireVsCodeApi();

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Listen for messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'receiveMessage':
          setMessages(prev => [...prev, { sender: 'agent', text: message.text }]);
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
      vscode.postMessage({ command: 'sendMessage', text: input });
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--vscode-font-family)', backgroundColor: 'var(--vscode-editor-background)', color: 'var(--vscode-editor-foreground)' }}>
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid var(--vscode-input-border)',
            backgroundColor: 'var(--vscode-input-background)',
            color: 'var(--vscode-input-foreground)'
          }}
        />
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