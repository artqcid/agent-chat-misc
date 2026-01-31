# Security Policy

## 🔒 Sicherheitsübersicht

Die Sicherheit unserer Benutzer hat für uns höchste Priorität. Diese Richtlinie beschreibt, wie Sicherheitslücken gemeldet und behandelt werden.

## 🚨 Sicherheitslücken melden

**Bitte melden Sie Sicherheitslücken NICHT über öffentliche GitHub Issues!**

### Wie Sie eine Sicherheitslücke melden:

1. **E-Mail**: Senden Sie eine detaillierte Beschreibung an `security@agent-chat-misc.dev`
2. **Betreff**: `[SECURITY] Kurzbeschreibung der Lücke`
3. **Inhalt**:
   - Detaillierte Beschreibung der Sicherheitslücke
   - Schritte zur Reproduktion
   - Potenzielle Auswirkungen
   - Ihre Kontaktinformationen für Rückfragen

### Was Sie in Ihrer Meldung angeben sollten:

```markdown
## Sicherheitslücke: [Titel]

### Beschreibung
[Detaillierte Beschreibung der Sicherheitslücke]

### Schweregrad
- [ ] Kritisch (Remote Code Execution, etc.)
- [ ] Hoch (Datenlecks, etc.)
- [ ] Mittel (DoS, etc.)
- [ ] Niedrig (Informationslecks, etc.)

### Reproduktion
1. Schritt 1
2. Schritt 2
3. Schritt 3

### Auswirkungen
[Potenzielle Auswirkungen auf Benutzer]

### Systeminformationen
- OS: [Windows/Linux/macOS]
- VS Code Version: [z.B. 1.80.0]
- Extension Version: [z.B. 0.0.1]
```

## ⏱️ Reaktionszeiten

Wir verpflichten uns zu folgenden Reaktionszeiten:

- **Erstkontakt**: Innerhalb von 48 Stunden
- **Update**: Alle 7 Tage während der Untersuchung
- **Fix-Release**: Innerhalb von 90 Tagen nach Bestätigung (abhängig von Schweregrad)

## 🔧 Unterstützte Versionen

Sicherheitsupdates werden nur für die folgenden Versionen bereitgestellt:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |
| < 0.0.0 | :x:                |

## 🛡️ Bekannte Sicherheitsaspekte

### API Keys
- API Keys werden **NIE** im Code gespeichert oder übertragen
- Keys werden nur lokal in VS Code Settings gespeichert
- Verschlüsselte Speicherung über VS Code's Secure Storage

### Netzwerkkommunikation
- Alle externen Verbindungen verwenden HTTPS/TLS
- Selbstsignierte Zertifikate werden abgelehnt
- HTTP-Only Modus für lokale Entwicklung verfügbar

### Datenverarbeitung
- Chat-Nachrichten werden nur temporär im Speicher gehalten
- Keine dauerhafte Speicherung sensibler Daten
- Lokale Konfiguration hat Vorrang vor Remote-Settings

## 🚫 Nicht als Sicherheitslücken betrachtet

Die folgenden Punkte werden **NICHT** als Sicherheitslücken behandelt:

- Fehlende Rate Limiting für API-Endpoints (bekanntes Feature)
- HTTP-Modus für lokale Entwicklung
- Debug-Informationen in Entwicklungsmodus
- Abhängigkeiten mit bekannten, nicht-kritischen CVEs

## 🏷️ Sicherheits-Labels

Wir verwenden folgende Labels für Sicherheits-Issues:

- `🔴 security/critical`: Kritische Sicherheitslücke
- `🟠 security/high`: Hohe Sicherheitslücke
- `🟡 security/medium`: Mittlere Sicherheitslücke
- `🟢 security/low`: Niedrige Sicherheitslücke
- `🔵 security/info`: Sicherheitsrelevante Information

## 📋 Best Practices für Benutzer

### Sichere Konfiguration
```json
{
  "agentChat.apiSecurity": {
    "requireHttps": true,
    "validateCertificates": true,
    "allowedHosts": ["api.openai.com", "localhost"],
    "maxRequestSize": "10MB"
  }
}
```

### API Key Management
- Verwenden Sie dedizierte API Keys mit minimalen Berechtigungen
- Rotieren Sie Keys regelmäßig
- Speichern Sie Keys nicht in unsicheren Locations

### Netzwerksicherheit
- Verwenden Sie VPNs in unsicheren Netzwerken
- Aktivieren Sie Firewalls
- Überwachen Sie Netzwerkverkehr bei Bedarf

## 🤝 Verantwortlichkeiten

### Unsere Verantwortlichkeiten
- Sicherheitslücken zeitnah beheben
- Transparente Kommunikation über Sicherheitsprobleme
- Regelmäßige Security Audits
- Sicherheitsupdates bereitstellen

### Ihre Verantwortlichkeiten
- Sicherheitslücken verantwortungsvoll melden
- Systeme aktuell halten
- Sichere Konfiguration verwenden
- Sensible Daten schützen

## 📞 Kontakt

**Security Team**
- E-Mail: `security@agent-chat-misc.dev`
- PGP Key: [Link zum PGP Key]
- Response Time: 48 Stunden

**Allgemeiner Support**
- Issues: [GitHub Issues](https://github.com/artqcid/agent-chat-misc/issues)
- Discussions: [GitHub Discussions](https://github.com/artqcid/agent-chat-misc/discussions)

## 📜 Lizenz

Diese Security Policy unterliegt der gleichen MIT-Lizenz wie das Projekt.

---

**Zuletzt aktualisiert:** Januar 2024