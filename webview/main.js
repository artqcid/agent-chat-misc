// Webview script for Agent Chat
const vscode = acquireVsCodeApi();

const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const messages = document.getElementById('messages');

sendButton.addEventListener('click', () => {
  const text = input.value;
  if (text) {
    // Send message to extension
    vscode.postMessage({ command: 'sendMessage', text });
    // Add to UI
    addMessage('user', text);
    input.value = '';
  }
});

function addMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}