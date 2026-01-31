# Agent Chat Misc - VS Code Extension

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://marketplace.visualstudio.com/items?itemName=artqcid.agent-chat-misc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Eine hochkonfigurierbare Chat-Agent-Erweiterung für VS Code mit einer GUI identisch zu GitHub Copilot. Unterstützt lokale und entfernte LLMs, MCP/RAG/Embedding-Integration, dynamische Kontext- und Prompt-Verwaltung.

## ✨ Features

### 🎯 **Kernfunktionalität**
- **Copilot-ähnliche GUI**: Identische Benutzeroberfläche wie GitHub Copilot
- **Mehrere LLM-Provider**: OpenAI, Local LLMs (Llama.cpp, Ollama)
- **Modell-Wechsel**: Nahtloser Wechsel zwischen Modellen mit Chat-Verlauf-Erhaltung
- **System-Prompts**: Konfigurierbare System-Prompts pro Chat oder global

### 🔧 **Erweiterte Features**
- **Sidebar-Integration**: Ständige Verfügbarkeit wie GitHub Copilot (Tree View)
- **Health Monitoring**: Automatische Server-Verfügbarkeitsprüfung mit Statusanzeigen
- **Reload-Mechanismus**: Live-Neuladen von Konfiguration und Verbindungen
- **MCP-Integration**: Model Context Protocol für dynamische Kontexte und Prompts
- **RAG-Unterstützung**: Retrieval-Augmented Generation für verbesserte Antworten
- **Embedding-Integration**: Vektor-basierte Suche und Kontext-Erweiterung

### 🎨 **Benutzeroberfläche**
- **Autocomplete**: Intelligente Vervollständigung für @Kontexte und /Prompts
- **Status-Meldungen**: Echtzeit-Verbindungsstatus und Fehlerbenachrichtigungen
- **Responsive Design**: Anpassung an VS Code Themes und Fenstergrößen
- **Tastatur-Navigation**: Tab/Enter für effiziente Bedienung

### 🔌 **API & Integrationen**
- **REST API**: Vollständige HTTP-API für externe Integrationen
- **WebSocket-Ready**: Architektur vorbereitet für Streaming-Chat
- **Konfigurations-API**: Programmatischer Zugriff auf Einstellungen
- **Erweiterbare Provider**: Einfache Hinzufügung neuer LLM-Provider

## 📦 Installation

### Option 1: VS Code Marketplace (Empfohlen)
1. Öffnen Sie VS Code
2. Gehen Sie zu Extensions (`Ctrl+Shift+X`)
3. Suchen Sie nach "Agent Chat Misc"
4. Klicken Sie auf "Install"

### Option 2: Manuelle Installation (.vsix)
1. Laden Sie die neueste `.vsix`-Datei von [Releases](https://github.com/artqcid/agent-chat-misc/releases) herunter
2. Öffnen Sie VS Code
3. `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
4. Wählen Sie die heruntergeladene Datei aus

### Option 3: Development Setup
```bash
git clone https://github.com/artqcid/agent-chat-misc.git
cd agent-chat-misc
npm install
npm run compile
# F5 zum Debuggen in VS Code
```

## 🚀 Schnellstart

### Chat öffnen
1. `Ctrl+Shift+P` → "Agent Chat: Open Agent Chat"
2. Oder klicken Sie auf das Chat-Symbol in der Sidebar
3. Wählen Sie Provider und Modell aus
4. Beginnen Sie zu chatten!

### Erste Konfiguration
1. `Ctrl+Shift+P` → "Agent Chat: Open Settings"
2. Konfigurieren Sie Ihre LLM-Provider
3. Testen Sie die Verbindung mit Health Checks
4. Speichern und neu laden

## 📖 Detaillierte Nutzung

### Chat-Interface
- **Nachrichten senden**: Enter drücken oder Send-Button klicken
- **Kontext hinzufügen**: `@context-name` für MCP-Kontexte
- **Prompt verwenden**: `/prompt-name` für gespeicherte Prompts
- **System-Prompt ändern**: Textarea oben im Chat bearbeiten
- **Chat-Verlauf**: Automatisch gespeichert und wiederhergestellt

### Sidebar-Integration
- **Ständige Verfügbarkeit**: Wie GitHub Copilot immer sichtbar
- **Schnellzugriff**: Ein Klick öffnet den Chat
- **Status-Indikatoren**: Grün = Verbunden, Rot = Fehler

### Health Checks
- **Automatische Prüfung**: Server-Verfügbarkeit wird regelmäßig getestet
- **Status-Anzeige**: Im Chat-Fenster und Sidebar
- **Fehler-Meldungen**: Klare Benachrichtigungen bei Verbindungsproblemen
- **Auto-Recovery**: Automatische Wiederverbindung bei temporären Ausfällen

### Reload-Funktionalität
- **Konfiguration neu laden**: Änderungen sofort wirksam machen
- **Verbindungen refreshen**: Server-Verbindungen neu aufbauen
- **Cache leeren**: Alte Daten entfernen und neu laden

## ⚙️ Konfiguration

Die Erweiterung verwendet eine JSON-basierte Konfiguration. Bearbeiten Sie diese über die Settings-UI oder direkt in VS Code Settings.

### Grundlegende Konfiguration
```json
{
  "agentChat.providers": [
    {
      "name": "OpenAI",
      "type": "openai",
      "apiKey": "your-api-key",
      "models": ["gpt-4", "gpt-3.5-turbo"],
      "defaultModel": "gpt-4"
    },
    {
      "name": "Local LLM",
      "type": "local",
      "url": "http://localhost:8080",
      "models": ["qwen2.5-7b"],
      "defaultModel": "qwen2.5-7b"
    }
  ],
  "agentChat.mcpServers": [
    {
      "name": "MCP Server",
      "url": "http://localhost:3000",
      "enabled": true
    }
  ],
  "agentChat.systemPrompt": "You are a helpful AI assistant.",
  "agentChat.healthCheckInterval": 30000,
  "agentChat.maxRetries": 3
}
```

### Provider-Konfiguration

#### OpenAI Provider
```json
{
  "name": "OpenAI",
  "type": "openai",
  "apiKey": "sk-...",
  "baseUrl": "https://api.openai.com/v1",
  "models": ["gpt-4", "gpt-3.5-turbo"],
  "defaultModel": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

#### Local LLM Provider
```json
{
  "name": "Llama.cpp",
  "type": "local",
  "url": "http://localhost:8080",
  "models": ["qwen2.5-7b", "llama-7b"],
  "defaultModel": "qwen2.5-7b",
  "timeout": 30000
}
```

### MCP-Server-Konfiguration
```json
{
  "name": "My MCP Server",
  "url": "http://localhost:3000",
  "enabled": true,
  "auth": {
    "type": "bearer",
    "token": "your-token"
  },
  "endpoints": {
    "contexts": "/api/contexts",
    "prompts": "/api/prompts"
  }
}
```

### Erweiterte Einstellungen
- `healthCheckInterval`: Health Check Intervall in ms (Standard: 30000)
- `maxRetries`: Maximale Wiederholungsversuche (Standard: 3)
- `timeout`: Request Timeout in ms (Standard: 30000)
- `autoReload`: Automatisches Neuladen bei Konfigurationsänderungen (Standard: true)

## 🔌 API-Dokumentation

Die Erweiterung stellt eine REST-API auf Port 3001 bereit.

### Endpoints

#### POST `/chat`
Sendet eine Chat-Nachricht und erhält eine AI-Antwort.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "systemPrompt": "You are a helpful assistant.",
  "provider": "OpenAI",
  "model": "gpt-4",
  "contexts": ["context1", "context2"],
  "prompts": ["prompt1"]
}
```

**Response:**
```json
{
  "reply": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "provider": "OpenAI",
  "model": "gpt-4",
  "timestamp": "2024-01-31T10:00:00Z",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 20,
    "totalTokens": 30
  }
}
```

#### GET `/health`
Überprüft den Status aller konfigurierten Server.

**Response:**
```json
{
  "status": "healthy",
  "providers": {
    "OpenAI": "healthy",
    "LocalLLM": "healthy"
  },
  "mcpServers": {
    "MCP Server": "healthy"
  },
  "timestamp": "2024-01-31T10:00:00Z"
}
```

#### GET `/config`
Gibt die aktuelle Konfiguration zurück (ohne sensitive Daten).

#### POST `/reload`
Lädt Konfiguration und Verbindungen neu.

**Response:**
```json
{
  "status": "reloaded",
  "message": "Configuration and connections reloaded successfully"
}
```

### Authentifizierung
API-Requests können mit einem Bearer-Token authentifiziert werden:
```
Authorization: Bearer your-api-token
```

Konfigurieren Sie den Token in den Extension-Einstellungen.

## 🔧 Troubleshooting

### Häufige Probleme

#### "Provider nicht verfügbar"
**Symptom:** Fehler "Provider X ist nicht verfügbar"
**Lösung:**
1. Überprüfen Sie die Provider-Konfiguration
2. Testen Sie die Verbindung mit "Test Connection" in Settings
3. Stellen Sie sicher, dass der Server läuft
4. Prüfen Sie Firewall- und Netzwerkeinstellungen

#### "MCP-Server nicht erreichbar"
**Symptom:** Keine Autocomplete für @Kontexte oder /Prompts
**Lösung:**
1. Überprüfen Sie die MCP-Server-URL
2. Stellen Sie sicher, dass der MCP-Server läuft
3. Prüfen Sie die Authentifizierung
4. Verwenden Sie "Reload" in den Settings

#### "Chat-Fenster öffnet nicht"
**Symptom:** Chat-Befehl funktioniert nicht
**Lösung:**
1. Überprüfen Sie VS Code Developer Console auf Fehler
2. Starten Sie VS Code neu
3. Deinstallieren und reinstallieren Sie die Extension
4. Prüfen Sie, ob andere Extensions Konflikte verursachen

#### "Hohe CPU-Auslastung"
**Symptom:** VS Code wird langsam
**Lösung:**
1. Reduzieren Sie `healthCheckInterval` in den Settings
2. Deaktivieren Sie nicht benötigte Provider
3. Verwenden Sie "Reload" um Verbindungen zu resetten

### Debug-Modus
1. Öffnen Sie Developer Console: `Ctrl+Shift+P` → "Developer: Toggle Developer Tools"
2. Suchen Sie nach Fehlermeldungen mit "agent-chat"
3. Überprüfen Sie Network-Tab für API-Requests

### Logs
Logs finden Sie in:
- VS Code Output Panel: "Agent Chat Misc"
- Developer Console für detaillierte Fehler

## 🏗️ Architektur

Die Extension folgt Clean Code Prinzipien mit modularer Architektur:

```
src/
├── core/                    # Business Logic
│   ├── interfaces/         # Abstractions (SOLID)
│   ├── services/          # Core Services
│   ├── domain/            # Domain Models
│   └── types/             # Type Definitions
├── infrastructure/         # External Concerns
│   ├── storage/           # Configuration Persistence
│   ├── providers/         # LLM Implementations
│   └── http/              # HTTP API Server
├── ui/                     # Presentation Layer
│   └── controllers/       # WebView Controllers
├── di/                     # Dependency Injection
├── shared/                 # Cross-cutting Concerns
└── test/                   # Unit Tests
```

### Schlüsselkomponenten
- **ChatService**: Chat-Logik und Nachrichtenverarbeitung
- **ProviderManager**: LLM-Provider-Verwaltung mit Health Checks
- **WebViewController**: UI-Controller für Chat und Settings
- **HttpApiService**: REST-API Server
- **Container**: Dependency Injection Container

## 🤝 Contributing

Wir freuen uns über Beiträge! Bitte lesen Sie unsere [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup
```bash
git clone https://github.com/artqcid/agent-chat-misc.git
cd agent-chat-misc
npm install
npm run watch
# F5 in VS Code für Debugging
```

### Testing
```bash
npm test              # Unit Tests
npm run test:watch    # Watch Mode
npm run lint          # Linting
```

### Pull Requests
1. Fork das Repository
2. Erstellen Sie einen Feature-Branch
3. Fügen Sie Tests für neue Features hinzu
4. Stellen Sie sicher, dass alle Tests bestehen
5. Erstellen Sie einen Pull Request mit detaillierter Beschreibung

## 📄 License

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🙏 Acknowledgments

- GitHub Copilot für die Inspiration der UI
- VS Code Extension API für die Plattform
- Open Source Community für LLM-Integrationen

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/artqcid/agent-chat-misc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/artqcid/agent-chat-misc/discussions)
- **Documentation**: [Wiki](https://github.com/artqcid/agent-chat-misc/wiki)
- **API Documentation**: [API.md](API.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Security Policy**: [SECURITY.md](SECURITY.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

**Viel Spaß mit Agent Chat Misc!** 🎉