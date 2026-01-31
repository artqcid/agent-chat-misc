# Contributing to Agent Chat Misc

Vielen Dank für Ihr Interesse an der Agent Chat Misc Extension! Wir freuen uns über Beiträge aller Art - von Bugfixes über neue Features bis hin zu Dokumentationsverbesserungen.

## 📋 Inhaltsverzeichnis
- [Code of Conduct](#code-of-conduct)
- [Wie kann ich beitragen?](#wie-kann-ich-beitragen)
- [Development Setup](#development-setup)
- [Entwicklungsworkflow](#entwicklungsworkflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Architecture Guidelines](#architecture-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## 🤝 Code of Conduct

Dieses Projekt folgt einem Code of Conduct, um eine offene und einladende Umgebung zu gewährleisten. Bei der Teilnahme an diesem Projekt verpflichten Sie sich, alle Teilnehmer respektvoll und konstruktiv zu behandeln.

## ❓ Wie kann ich beitragen?

### Für Anfänger
- **🐛 Bug Reports**: Verwenden Sie die [Issue Templates](https://github.com/artqcid/agent-chat-misc/issues/new?template=bug_report.md)
- **💡 Feature Requests**: [Feature Request Template](https://github.com/artqcid/agent-chat-misc/issues/new?template=feature_request.md)
- **📖 Dokumentation**: README.md, Code-Kommentare oder Wiki-Artikel verbessern
- **🧪 Tests**: Zusätzliche Testfälle für bestehende Funktionalität

### Für erfahrene Entwickler
- **🔧 Neue Features**: Implementierung neuer LLM-Provider, UI-Verbesserungen
- **🏗️ Architecture**: Clean Code Prinzipien verbessern, Performance optimieren
- **🔌 Integrationen**: Neue MCP-Server, RAG-Systeme, Embedding-Provider
- **📊 Analytics**: Nutzungsstatistiken, Performance-Metriken

## 🚀 Development Setup

### Voraussetzungen
- **Node.js** 16+ und **npm**
- **VS Code** mit Extension Development Host
- **Git** für Versionskontrolle

### Schnellstart
```bash
# Repository klonen
git clone https://github.com/artqcid/agent-chat-misc.git
cd agent-chat-misc

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run watch

# In VS Code: F5 drücken für Debug-Modus
```

### Verfügbare Scripts
```bash
npm run compile      # TypeScript kompilieren
npm run watch        # Watch-Mode für Entwicklung
npm test            # Unit Tests ausführen
npm run test:watch  # Tests im Watch-Mode
npm run lint        # ESLint ausführen
npm run lint:fix    # ESLint mit Auto-Fix
npm run build       # Production Build erstellen
```

## 🔄 Entwicklungsworkflow

### 1. Issue erstellen
- Prüfen Sie bestehende Issues auf Duplikate
- Verwenden Sie entsprechende Issue Templates
- Beschreiben Sie das Problem/die Feature detailliert

### 2. Branch erstellen
```bash
# Für neue Features
git checkout -b feature/amazing-feature

# Für Bugfixes
git checkout -b fix/bug-description

# Für Dokumentation
git checkout -b docs/update-readme
```

### 3. Entwicklung
- Folgen Sie den [Coding Standards](#coding-standards)
- Schreiben Sie Tests für neue Funktionalität
- Testen Sie Ihre Änderungen gründlich
- Halten Sie Commits klein und fokussiert

### 4. Pull Request
- Stellen Sie sicher, dass alle Tests bestehen
- Aktualisieren Sie die Dokumentation falls nötig
- Verwenden Sie die PR Template
- Warten Sie auf Review

## 💻 Coding Standards

### TypeScript
- **Strict Mode**: Immer aktiviert
- **Interface vor Implementation**: Verwenden Sie Interfaces für alle Abhängigkeiten
- **Type Safety**: Vermeiden Sie `any`, verwenden Sie Union Types
- **Null Safety**: Verwenden Sie `strictNullChecks`

### Clean Code Prinzipien
- **Single Responsibility**: Jede Klasse/Funktion hat eine klare Verantwortung
- **Open/Closed**: Erweiterbar, aber nicht modifizierbar
- **Liskov Substitution**: Subtypen sind austauschbar
- **Interface Segregation**: Kleine, spezifische Interfaces
- **Dependency Inversion**: Abhängigkeiten von Abstractions

### Namenskonventionen
```typescript
// Interfaces
interface IChatService { }

// Klassen
class ChatService implements IChatService { }

// Methoden
public async sendMessage(message: string): Promise<void> { }

// Private Methoden
private validateMessage(message: string): boolean { }

// Konstanten
const MAX_RETRY_ATTEMPTS = 3;

// Enums
enum ProviderType {
  OpenAI = 'openai',
  Local = 'local'
}
```

### Dateiorganisation
```
src/
├── core/                    # Business Logic
│   ├── interfaces/         # IChatService.ts
│   ├── services/          # ChatService.ts
│   ├── domain/            # ChatMessage.ts
│   └── types/             # Config.ts
├── infrastructure/         # External Dependencies
│   ├── providers/         # OpenAIProvider.ts
│   ├── storage/           # VSCodeConfigService.ts
│   └── http/              # HttpApiService.ts
├── ui/                     # Presentation
│   └── controllers/       # WebViewController.ts
├── di/                     # Dependency Injection
├── shared/                 # Cross-cutting
└── test/                   # Tests
```

## 🧪 Testing

### Test-Struktur
- **Unit Tests**: Für einzelne Klassen/Funktionen
- **Integration Tests**: Für Komponenten-Interaktionen
- **E2E Tests**: Für vollständige Workflows (geplant)

### Test-Konventionen
```typescript
// Dateiname: ChatService.test.ts
import { expect } from 'chai';
import { ChatService } from '../src/core/services/ChatService';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      // Arrange
      const message = 'Hello';

      // Act
      const result = await service.sendMessage(message);

      // Assert
      expect(result).to.be.true;
    });

    it('should handle network errors', async () => {
      // Test error handling
    });
  });
});
```

### Test-Abdeckung
- **Ziel**: >80% Code Coverage
- **Kritische Pfade**: Alle Error-Handling Pfade testen
- **Edge Cases**: Null/Undefined Werte, Netzwerkfehler, Timeouts

## 🔍 Pull Requests

### PR Template
Bitte verwenden Sie diese Struktur für Pull Requests:

```markdown
## Beschreibung
[Kurze Beschreibung der Änderungen]

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] All tests pass

## Screenshots (falls UI-Änderungen)
[Bei UI-Änderungen Screenshots hinzufügen]

## Checklist
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Tests added for new functionality
- [ ] No breaking changes
```

### Review Process
1. **Automated Checks**: CI/CD Pipeline prüft Tests, Linting, Build
2. **Code Review**: Mindestens ein Maintainer muss approve geben
3. **Testing**: Reviewer testet die Änderungen manuell
4. **Merge**: Squash merge mit beschreibender Commit-Message

## 🏗️ Architecture Guidelines

### Dependency Injection
```typescript
// Richtig: Constructor Injection
export class ChatService {
  constructor(
    private readonly providerManager: IProviderManager,
    private readonly configService: IConfigService
  ) {}
}

// Falsch: Direct Instantiation
export class ChatService {
  private providerManager = new ProviderManager(); // ❌ Tight Coupling
}
```

### Error Handling
```typescript
// Richtig: Domain-specific Errors
export class ProviderNotAvailableError extends Error {
  constructor(providerName: string) {
    super(`Provider ${providerName} is not available`);
    this.name = 'ProviderNotAvailableError';
  }
}

// Usage
try {
  await provider.sendMessage(message);
} catch (error) {
  if (error instanceof ProviderNotAvailableError) {
    // Handle specific error
  }
  throw error; // Re-throw unknown errors
}
```

### Async/Await Patterns
```typescript
// Richtig: Async Method
public async sendMessage(message: string): Promise<ChatResponse> {
  this.validateMessage(message);

  try {
    const response = await this.provider.sendMessage(message);
    await this.saveToHistory(message, response);
    return response;
  } catch (error) {
    await this.handleError(error);
    throw error;
  }
}
```

## 📝 Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: Neue Features
- **fix**: Bugfixes
- **docs**: Dokumentation
- **style**: Code Style Änderungen (Linting, Formatierung)
- **refactor**: Code Refactoring
- **test**: Tests hinzufügen/ändern
- **chore**: Build, Dependencies, etc.

### Beispiele
```
feat(chat): add message encryption

Add end-to-end encryption for chat messages using AES-256.
Supports both OpenAI and Local LLM providers.

Closes #123
```

```
fix(health-check): handle connection timeouts

Fix timeout handling in health check service to prevent
infinite waiting on unresponsive servers.

Fixes #456
```

```
refactor(core): extract provider interface

Extract IProvider interface from concrete implementations
to improve testability and maintainability.

- Add IProvider interface in core/interfaces/
- Update all provider implementations
- Add unit tests for interface compliance
```

## 🎯 Best Practices

### Performance
- **Lazy Loading**: Provider nur bei Bedarf laden
- **Connection Pooling**: Wiederverwendung von HTTP-Verbindungen
- **Caching**: Konfiguration und Health-Status cachen
- **Memory Management**: Event Listener ordnungsgemäß entfernen

### Sicherheit
- **API Keys**: Niemals in Code committen
- **Input Validation**: Alle User-Inputs validieren
- **HTTPS Only**: Nur verschlüsselte Verbindungen
- **Rate Limiting**: API-Aufrufe limitieren

### Accessibility
- **Keyboard Navigation**: Alle Features per Tastatur bedienbar
- **Screen Reader**: ARIA-Labels für UI-Elemente
- **Color Contrast**: Ausreichender Kontrast für alle Themes
- **Focus Management**: Klarer Fokus-Fluss

## 📞 Support

Bei Fragen:
- **Issues**: Für Bugs und Feature Requests
- **Discussions**: Für allgemeine Fragen
- **Discord**: Für Community-Support (geplant)

## 🙏 Acknowledgments

Vielen Dank an alle Contributors und die Open-Source-Community für ihre Unterstützung!

---

**Happy Contributing!** 🚀