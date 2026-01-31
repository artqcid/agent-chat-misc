# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-01-31

### ✨ Added
- **Erstveröffentlichung** der Agent Chat Misc Extension
- **Copilot-ähnliche GUI** mit React-basiertem WebView
- **Mehrere LLM-Provider** Unterstützung (OpenAI, Local LLMs)
- **Sidebar-Integration** für ständige Verfügbarkeit wie GitHub Copilot
- **Health Monitoring** mit automatischen Server-Verfügbarkeitsprüfungen
- **Reload-Mechanismus** für Live-Konfiguration und Verbindungen
- **MCP-Integration** (Model Context Protocol) für dynamische Kontexte
- **RAG-Unterstützung** (Retrieval-Augmented Generation)
- **Embedding-Server-Integration** für vektor-basierte Suche
- **Autocomplete-Funktionalität** für @Kontexte und /Prompts
- **REST-API** auf Port 3001 für externe Integrationen
- **Clean Code Architektur** mit Dependency Injection und SOLID-Prinzipien
- **Umfassende Testabdeckung** mit Mocha für Unit-Tests
- **Konfigurationssystem** mit JSON-Editor und UI
- **Error Handling** mit benutzerfreundlichen Meldungen
- **Status-Indikatoren** für Echtzeit-Verbindungsstatus

### 🏗️ Changed
- **Vollständige Refaktorierung** von monolithischer zu modularer Clean Code Architektur
- **Interface-Driven Design** mit Dependency Injection Container
- **Separation of Concerns** in Core, Infrastructure, UI und Shared Layer

### 🔧 Technical Details
- **TypeScript** für typsichere Entwicklung
- **VS Code Extension API** für native Integration
- **React** für moderne WebView-UI
- **Axios** für HTTP-Kommunikation
- **Modulare Architektur** mit 90+ kleinen, fokussierten Klassen
- **SOLID-Prinzipien** vollständig implementiert
- **Testgetriebene Entwicklung** mit umfassender Test-Suite

### 📚 Documentation
- **Vollständige README.md** mit Installation, Konfiguration und API-Dokumentation
- **Entwickler-Dokumentation** in agent-plan.md für Clean Code Architektur
- **Troubleshooting-Guide** für häufige Probleme
- **MIT-Lizenz** für Open-Source-Verfügbarkeit

### 🎯 Known Limitations
- Streaming-Chat noch nicht implementiert (WebSocket-Ready Architektur)
- Frontend-Tests noch nicht vollständig (Jest geplant)
- Marketplace-Publishing noch ausstehend

---

## Version History Guide

### Version Numbering
- **MAJOR.MINOR.PATCH** (z.B. 1.2.3)
- **MAJOR**: Breaking Changes
- **MINOR**: Neue Features (backward compatible)
- **PATCH**: Bugfixes (backward compatible)

### Types of Changes
- **Added** für neue Features
- **Changed** für Änderungen an bestehenden Features
- **Deprecated** für bald entfernte Features
- **Removed** für entfernte Features
- **Fixed** für Bugfixes
- **Security** für Sicherheitsrelevante Änderungen

---

[Unreleased]: Features und Fixes für zukünftige Versionen