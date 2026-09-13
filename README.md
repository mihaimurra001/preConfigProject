# AI Agent Project Configurator (Web & CLI)

Un sistem complet și vizual pentru pre-configurarea proiectelor software cu **Skills**, **Plugin-uri**, **Reguli** și **Servere MCP** compatibile cu **Claude Code CLI** și **Google Antigravity CLI** (`agy`).

Sistemul integrează:
- **[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)**: 25 de abilități avansate de inginerie software (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, etc.).
- **[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)**: Filosofia „Lazy Senior Dev” – minimizare cod (~54% mai puțin cod), YAGNI, standard library și API-uri native.
- **[headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom)**: Motor avansat de compresie semantică (SmartCrusher, CodeCompressor, Kompress-v2, CCR) reducând tokenii cu 20–90%.
- **[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)**: Graf de cunoștințe multimodal AST deterministic și server MCP pentru interogarea structurii arhitecturale cu economie masivă de tokeni (până la 70x).
- **Design & UI Engineering Suite**: Taste-Skill (anti-slop, the Three Dials), Impeccable (23 comenzi de craft), Emil Kowalski (animații fluide 60fps) și Awesome-Design-MD (preseturi de brand).
- **Cybersecurity & AppSec Suite**: OWASP & MITRE defense, STRIDE threat modeling, NVIDIA secret scanning și Trail of Bits supply chain audit.

---

## 🚀 Pornire Rapidă

Serverul backend rulează pe Node.js (port `3030`):

```bash
# Instalare dependențe (dacă nu au fost instalate deja)
npm install

# Pornire server
npm start
```

Deschide în browser:
👉 **[http://localhost:3030](http://localhost:3030)**

---

## ⚙️ Structura Aplicației

- `server.js`: Server Express ce expune API REST și flux SSE pentru execuția comenzilor de terminal în timp real.
- `lib/skills-catalog.js`: Catalogul complet de definiții, comenzi și șabloane markdown pentru skills, ponytail și graphify.
- `lib/generator.js`: Motorul de sinteză a configurațiilor pentru Antigravity CLI, Claude Code CLI sau modul Unified (ambele).
- `lib/installer.js`: Modul pentru detectarea automată a mediului de rulare (Node, Python, git, agy, claude) și scrierea fișierelor pe disc.
- `public/`: Interfață web modernă (Single Page Application cu Tailwind CSS, Dark Theme, Live File Previewer și consolă interactivă).

---

## 📁 Fișiere Generate într-un Proiect Țintă

Când aplici configurația pe un proiect, sistemul creează:

```text
proiect-tinta/
├── AGENTS.md                  # Reguli universale cross-agent (Antigravity, Claude, Cursor, Copilot)
├── GEMINI.md                  # Reguli specifice Antigravity CLI (încărcate la startup)
├── CLAUDE.md                  # Instrucțiuni specifice Claude Code CLI
├── setup-ai-environment.sh    # Script executabil pentru sincronizarea CLI și instalarea dependențelor
├── .agents/                   # Configurații Antigravity CLI
│   ├── rules/
│   │   ├── ponytail.md        # Regula lazy senior dev
│   │   └── graphify.md        # Directiva de interogare a grafului de cunoștințe
│   ├── skills/
│   │   ├── spec-driven-development/SKILL.md
│   │   ├── planning-and-task-breakdown/SKILL.md
│   │   ├── incremental-implementation/SKILL.md
│   │   ├── test-driven-development/SKILL.md
│   │   ├── code-review-and-quality/SKILL.md
│   │   ├── ponytail-review/SKILL.md
│   │   └── graphify/SKILL.md
│   ├── workflows/
│   │   └── graphify.md
│   └── mcp_config.json        # Configurare MCP Server (Graphify uv run)
└── .claude/                   # Configurații Claude Code CLI
    ├── settings.json          # MCP servers & permisiuni
    └── skills/                # Skills pentru Claude Code
```
