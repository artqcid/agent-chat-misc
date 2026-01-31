## Plan: Agent-Chat-Misc VS Code Extension

Ein hochkonfigurierbarer Chat-Agent als VS Code Extension mit exakt gleicher GUI wie GitHub Copilot, Unterstützung für lokale/remote LLMs, Provider- und Modellwechsel, MCP/RAG/Embedding-Integration und fortschrittlicher Kontext-/Prompt-Auswahl.

---

### Schritt-für-Schritt-Plan (nur Topics)
1. Projektstruktur & Grundgerüst der Extension
2. GUI-Design (exakt wie GitHub Copilot)
3. Chat-Agent-Logik & Backend-Kommunikation
4. LLM-Provider-Management (lokal/remote, Modellwechsel)
5. MCP/RAG/Embedding-Integration & Multi-MCP-Support
6. Kontext- & Prompt-Management (Autocomplete, Auswahl)
7. Konfigurationssystem (JSON & UI-Editor)
8. Systemprompt-Handling & Benutzerprompts
9. Erweiterbarkeit & API-Design
10. Testing, Dokumentation, UX-Feinschliff

---

### Benötigte Technologien
- **VS Code Extension API** (TypeScript)
- **React** (für komplexe, Copilot-ähnliche GUI)
- **Tailwind CSS** oder **Fluent UI** (für modernes, anpassbares Design)
- **Node.js** (Backend-Kommunikation, ggf. Proxy)
- **Axios/Fetch** (HTTP-Kommunikation)
- **WebSocket** (für Streaming/Live-Chat)
- **JSON Schema** (für Konfigurationsvalidierung)
- **Jest** (Testing)
- **YAML/JSON** (Konfigurationsdateien)

---

### GUI-Technologie-Vorschlag
- **React** mit **Fluent UI** (Microsoft) für maximale Ähnlichkeit zu Copilot und native VS Code UX.
- Alternativ: **Svelte** (schnell, aber weniger verbreitet in VS Code Extensions).

---

### Ausführliche Schritte

1. **Projektstruktur & Grundgerüst**
   - Initialisiere ein neues VS Code Extension-Projekt (TypeScript).
   - Lege Verzeichnisse für UI, Backend-Kommunikation, Konfiguration, Provider, MCP/RAG/Embedding an.

2. **GUI-Design (wie Copilot)**
   - Baue ein Chat-Panel mit React & Fluent UI, das exakt das Look & Feel von Copilot nachbildet.
   - Implementiere Message-Bubbles, Eingabefeld, Modell-/Provider-Auswahl, Kontext-/Prompt-Auswahlleiste.

3. **Chat-Agent-Logik & Backend-Kommunikation**
   - Implementiere die Chat-Logik (Message-Queue, Verlauf, Kontext-Handling).
   - Baue eine flexible Backend-Kommunikationsschicht (HTTP/REST/WebSocket, konfigurierbar).

4. **LLM-Provider-Management**
   - Implementiere Provider-Registry für lokale (Ollama, Llama.cpp, Qwen, weitere) und remote LLMs.
   - Ermögliche dynamischen Modellwechsel (mit Kontextverlust, aber Chatverlauf erhalten).
   - Zeige verfügbare Modelle je Provider in der Konfiguration an.

5. **MCP/RAG/Embedding-Integration**
   - Integriere mehrere MCP-Server (Default: MCP Server Misc).
   - Binde RAG- und Embedding-Server ein (Default: jeweilige Server im Projekt).
   - Stelle sicher, dass parallele Verbindungen und Kontextmanagement möglich sind.

6. **Kontext- & Prompt-Management**
   - Implementiere Autocomplete für @Kontexte und /Prompts (Daten aus MCP).
   - Erlaube Auswahl und Filterung im Chatfenster.
   - Synchronisiere Kontext-/Prompt-Liste mit MCP-Server.

7. **Konfigurationssystem**
   - JSON-basierte Konfigurationsdateien (ähnlich Continue).
   - UI-Editor für Konfiguration (Provider, Modelle, Server, Defaults).
   - Validierung und Live-Reload der Konfiguration.

8. **Systemprompt-Handling & Benutzerprompts**
   - Erlaube das Erstellen, Bearbeiten und Aktivieren von Systemprompts.
   - Standardmäßig keine Systemprompts mitsenden.
   - UI für Systemprompt-Management.

9. **Erweiterbarkeit & API-Design**
   - Modulares Design für neue Provider, Server, Features.
   - Dokumentierte interne API für Erweiterungen.

10. **Testing, Dokumentation, UX-Feinschliff**
    - Schreibe Unit- und Integrationstests.
    - Dokumentiere alle Features und Konfigurationsoptionen.
    - Feinschliff für UX und Performance.

---

### Beste Vorschläge je Topic
- **GUI:** React + Fluent UI für Copilot-ähnliche UX.
- **Provider:** Unterstützung für Ollama, Llama.cpp, Qwen, OpenAI, LM Studio, Tabby.
- **Konfiguration:** JSON + UI-Editor, ähnlich Continue.
- **Kommunikation:** HTTP/REST + WebSocket, flexibel pro Provider.
- **Kontext/Prompt:** Autocomplete mit Live-Daten aus MCP.

---

### Alternative Lösungen je Schritt

- **GUI:** Svelte statt React (weniger verbreitet, aber performant).
- **Provider:** Nur REST statt WebSocket (weniger live, aber einfacher).
- **Konfiguration:** Nur JSON, kein UI-Editor (weniger benutzerfreundlich).
- **Prompt/Context:** Nur statische Listen, keine Live-Synchronisation (weniger dynamisch).
- **Testing:** Nur manuelle Tests, keine automatisierten Tests (nicht empfohlen).

---