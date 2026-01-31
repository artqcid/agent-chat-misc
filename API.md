# Agent Chat Misc - REST API Documentation

Die Agent Chat Misc Extension stellt eine umfassende REST-API für externe Integrationen bereit. Die API läuft standardmäßig auf Port 3001.

## 📋 Inhaltsverzeichnis
- [Übersicht](#übersicht)
- [Authentifizierung](#authentifizierung)
- [Endpoints](#endpoints)
- [Fehlerbehandlung](#fehlerbehandlung)
- [Beispiele](#beispiele)
- [SDKs und Libraries](#sdks-und-libraries)

## 🌐 Übersicht

### Base URL
```
http://localhost:3001
```

### Content-Type
```
Content-Type: application/json
```

### Rate Limiting
- **100 Requests pro Minute** pro IP
- **1000 Requests pro Stunde** pro IP
- Bei Überschreitung: `429 Too Many Requests`

### Versionierung
- **Aktuelle Version**: v1
- **Version Header**: `X-API-Version: v1`
- **Breaking Changes**: Neue Major-Version

## 🔐 Authentifizierung

### Bearer Token (Empfohlen)
```bash
curl -H "Authorization: Bearer your-api-token" \
     http://localhost:3001/chat
```

### API Key (Alternativ)
```bash
curl -H "X-API-Key: your-api-key" \
     http://localhost:3001/chat
```

### Token Konfiguration
Tokens werden in den VS Code Extension Settings konfiguriert:
```json
{
  "agentChat.apiTokens": [
    {
      "name": "my-app",
      "token": "your-secure-token",
      "permissions": ["read", "write"]
    }
  ]
}
```

## 📡 Endpoints

### POST `/chat`

Sendet eine Chat-Nachricht und erhält eine AI-Antwort.

#### Request
```http
POST /chat
Content-Type: application/json
Authorization: Bearer your-token

{
  "message": "Hello, how are you?",
  "systemPrompt": "You are a helpful assistant.",
  "provider": "OpenAI",
  "model": "gpt-4",
  "contexts": ["project-context", "user-preferences"],
  "prompts": ["coding-assistant"],
  "temperature": 0.7,
  "maxTokens": 2048,
  "stream": false
}
```

#### Parameter

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | ✅ | - | Die Chat-Nachricht |
| `systemPrompt` | string | ❌ | Extension Default | System-Prompt für den Chat |
| `provider` | string | ❌ | Default Provider | LLM-Provider (OpenAI, Local, etc.) |
| `model` | string | ❌ | Provider Default | Spezifisches Modell |
| `contexts` | string[] | ❌ | [] | MCP-Kontext IDs |
| `prompts` | string[] | ❌ | [] | MCP-Prompt IDs |
| `temperature` | number | ❌ | 0.7 | Kreativität (0.0 - 2.0) |
| `maxTokens` | number | ❌ | 2048 | Maximale Token-Länge |
| `stream` | boolean | ❌ | false | Streaming-Antwort (geplant) |

#### Response
```json
{
  "success": true,
  "data": {
    "reply": "Hello! I'm doing well, thank you for asking. How can I help you today?",
    "provider": "OpenAI",
    "model": "gpt-4",
    "timestamp": "2024-01-31T10:00:00Z",
    "usage": {
      "promptTokens": 25,
      "completionTokens": 32,
      "totalTokens": 57
    },
    "contextsUsed": ["project-context"],
    "promptsUsed": ["coding-assistant"]
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "OpenAI provider is currently unavailable",
    "details": {
      "provider": "OpenAI",
      "retryAfter": 30
    }
  }
}
```

---

### GET `/health`

Überprüft den Status aller konfigurierten Server und Provider.

#### Request
```http
GET /health
Authorization: Bearer your-token
```

#### Response
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-31T10:00:00Z",
    "version": "0.0.1",
    "uptime": 3600,
    "providers": {
      "OpenAI": {
        "status": "healthy",
        "latency": 245,
        "lastCheck": "2024-01-31T10:00:00Z"
      },
      "LocalLLM": {
        "status": "healthy",
        "latency": 12,
        "lastCheck": "2024-01-31T10:00:00Z"
      }
    },
    "mcpServers": {
      "MCP Server Misc": {
        "status": "healthy",
        "latency": 89,
        "lastCheck": "2024-01-31T10:00:00Z",
        "endpoints": {
          "contexts": "available",
          "prompts": "available"
        }
      }
    },
    "system": {
      "memory": {
        "used": 150,
        "total": 512,
        "unit": "MB"
      },
      "cpu": {
        "usage": 15.5
      }
    }
  }
}
```

#### Health Status Werte
- `healthy`: Alle Systeme funktionieren
- `degraded`: Einige Systeme haben Probleme
- `unhealthy`: Kritische Systeme ausgefallen

---

### GET `/providers`

Listet alle verfügbaren und konfigurierten Provider auf.

#### Request
```http
GET /providers
Authorization: Bearer your-token
```

#### Response
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "openai",
        "name": "OpenAI",
        "type": "remote",
        "status": "healthy",
        "models": [
          {
            "id": "gpt-4",
            "name": "GPT-4",
            "contextWindow": 8192,
            "maxTokens": 4096
          },
          {
            "id": "gpt-3.5-turbo",
            "name": "GPT-3.5 Turbo",
            "contextWindow": 4096,
            "maxTokens": 2048
          }
        ],
        "config": {
          "temperature": 0.7,
          "timeout": 30000
        }
      }
    ]
  }
}
```

---

### GET `/contexts`

Ruft verfügbare MCP-Kontexte ab.

#### Request
```http
GET /contexts
Authorization: Bearer your-token
```

#### Query Parameter
- `server`: MCP-Server Name (optional)
- `limit`: Maximale Anzahl (default: 50)
- `offset`: Offset für Pagination (default: 0)

#### Response
```json
{
  "success": true,
  "data": {
    "contexts": [
      {
        "id": "project-files",
        "name": "Project Files",
        "description": "Current project file structure",
        "server": "MCP Server Misc",
        "type": "filesystem",
        "lastUpdated": "2024-01-31T09:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 50,
      "offset": 0
    }
  }
}
```

---

### GET `/prompts`

Ruft verfügbare MCP-Prompts ab.

#### Request
```http
GET /prompts
Authorization: Bearer your-token
```

#### Response
```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": "code-review",
        "name": "Code Review",
        "description": "Comprehensive code review prompt",
        "server": "MCP Server Misc",
        "template": "Please review the following code: {{code}}",
        "variables": ["code"],
        "tags": ["development", "review"]
      }
    ]
  }
}
```

---

### GET `/config`

Gibt die aktuelle Konfiguration zurück (ohne sensitive Daten wie API Keys).

#### Request
```http
GET /config
Authorization: Bearer your-token
```

#### Response
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "name": "OpenAI",
        "type": "openai",
        "models": ["gpt-4", "gpt-3.5-turbo"],
        "defaultModel": "gpt-4"
      }
    ],
    "mcpServers": [
      {
        "name": "MCP Server Misc",
        "url": "http://localhost:3000",
        "enabled": true
      }
    ],
    "systemPrompt": "You are a helpful AI assistant.",
    "healthCheckInterval": 30000,
    "maxRetries": 3
  }
}
```

---

### POST `/reload`

Lädt Konfiguration und Verbindungen neu.

#### Request
```http
POST /reload
Authorization: Bearer your-token

{
  "components": ["providers", "mcpServers", "config"]
}
```

#### Parameter
- `components`: Array der zu reloadenden Komponenten (optional)

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Configuration and connections reloaded successfully",
    "reloaded": ["providers", "mcpServers", "config"],
    "timestamp": "2024-01-31T10:00:00Z"
  }
}
```

---

### WebSocket `/stream` (Geplant)

Streaming-Chat über WebSocket (noch nicht implementiert).

```javascript
const ws = new WebSocket('ws://localhost:3001/stream');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Token:', data.token);
};
```

## ⚠️ Fehlerbehandlung

### HTTP Status Codes

| Code | Bedeutung | Beschreibung |
|------|-----------|-------------|
| 200 | OK | Erfolgreiche Anfrage |
| 400 | Bad Request | Ungültige Parameter |
| 401 | Unauthorized | Authentifizierung fehlgeschlagen |
| 403 | Forbidden | Unzureichende Berechtigungen |
| 404 | Not Found | Endpoint/Resource nicht gefunden |
| 429 | Too Many Requests | Rate Limit überschritten |
| 500 | Internal Server Error | Serverfehler |
| 503 | Service Unavailable | Dienst temporär nicht verfügbar |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "additional error context"
    },
    "timestamp": "2024-01-31T10:00:00Z",
    "requestId": "req-12345"
  }
}
```

### Häufige Error Codes

| Code | Beschreibung |
|------|-------------|
| `INVALID_REQUEST` | Ungültige Request-Parameter |
| `AUTHENTICATION_FAILED` | Authentifizierung fehlgeschlagen |
| `PROVIDER_UNAVAILABLE` | LLM-Provider nicht verfügbar |
| `MCP_SERVER_ERROR` | MCP-Server Fehler |
| `RATE_LIMIT_EXCEEDED` | Rate Limit überschritten |
| `INTERNAL_ERROR` | Interner Serverfehler |

## 💡 Beispiele

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function sendChatMessage(message) {
  try {
    const response = await axios.post('http://localhost:3001/chat', {
      message: message,
      provider: 'OpenAI',
      model: 'gpt-4'
    }, {
      headers: {
        'Authorization': 'Bearer your-token',
        'Content-Type': 'application/json'
      }
    });

    console.log('AI Response:', response.data.data.reply);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}
```

### Python

```python
import requests
import json

def chat_with_ai(message):
    url = "http://localhost:3001/chat"
    headers = {
        "Authorization": "Bearer your-token",
        "Content-Type": "application/json"
    }
    data = {
        "message": message,
        "provider": "OpenAI",
        "model": "gpt-4"
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code == 200:
        return response.json()["data"]["reply"]
    else:
        raise Exception(f"API Error: {response.json()}")
```

### cURL

```bash
# Chat-Nachricht senden
curl -X POST http://localhost:3001/chat \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing",
    "provider": "OpenAI",
    "model": "gpt-4",
    "temperature": 0.7
  }'

# Health-Check
curl -H "Authorization: Bearer your-token" \
     http://localhost:3001/health

# Konfiguration neu laden
curl -X POST http://localhost:3001/reload \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"components": ["providers"]}'
```

## 📚 SDKs und Libraries

### Community SDKs (Geplant)
- **agent-chat-js**: JavaScript/TypeScript SDK
- **agent-chat-py**: Python SDK
- **agent-chat-go**: Go SDK

### OpenAPI Spezifikation
Eine vollständige OpenAPI 3.0 Spezifikation ist verfügbar unter:
```
/docs/openapi.yaml
```

## 🔒 Sicherheit

### Best Practices
- **HTTPS verwenden** in Produktionsumgebungen
- **API Tokens rotieren** regelmäßig
- **IP Whitelisting** für sensitive Deployments
- **Request Logging** für Debugging (ohne sensitive Daten)
- **Rate Limiting** respektieren

### Security Headers
Die API sendet automatisch Security Headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

## 📞 Support

Bei API-Fragen:
- **API Issues**: [GitHub Issues mit "api" Label](https://github.com/artqcid/agent-chat-misc/issues?q=label%3Aapi)
- **Documentation Issues**: [Docs Repository](https://github.com/artqcid/agent-chat-misc)
- **Community Support**: [GitHub Discussions](https://github.com/artqcid/agent-chat-misc/discussions)

---

**API Version:** v1.0 | **Letzte Aktualisierung:** 2024-01-31