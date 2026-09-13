# Graph Report - preConfigProject  (2026-09-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 147 nodes · 164 edges · 35 communities (12 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- app.js
- package.json
- server.js
- installer.js
- AGENTS.md
- CLAUDE.md
- GEMINI.md
- AI Agent Project Configurator (Web & CLI)
- Graphify Knowledge Graph Skill
- Spec-Driven Development
- Graphify Knowledge Graph Skill
- Spec-Driven Development
- Incremental Implementation
- Planning & Task Breakdown
- Incremental Implementation
- Planning & Task Breakdown
- rules/graphify.md
- ponytail.md
- .agents/skills/code-review-and-quality/SKILL.md
- .agents/skills/code-simplification/SKILL.md
- .agents/skills/ponytail-audit/SKILL.md
- .agents/skills/ponytail-review/SKILL.md
- .agents/skills/shipping-and-launch/SKILL.md
- .agents/skills/test-driven-development/SKILL.md
- workflows/graphify.md
- .claude/skills/code-review-and-quality/SKILL.md
- .claude/skills/code-simplification/SKILL.md
- .claude/skills/ponytail-audit/SKILL.md
- .claude/skills/ponytail-review/SKILL.md
- .claude/skills/shipping-and-launch/SKILL.md
- .claude/skills/test-driven-development/SKILL.md
- install-global-ai-tools.sh
- test-project-demo/setup-ai-environment.sh
- setup-ai-environment.sh

## God Nodes (most connected - your core abstractions)
1. `setupEventListeners()` - 9 edges
2. `renderSkillsList()` - 6 edges
3. `inspectDirectory()` - 5 edges
4. `renderFileTree()` - 5 edges
5. `triggerPreview()` - 5 edges
6. `resolveUserPath()` - 5 edges
7. `applyConfiguration()` - 4 edges
8. `generateConfig()` - 4 edges
9. `AI Agent Project Configurator (Web & CLI)` - 4 edges
10. `runTerminalCommand()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (35 total, 22 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.25
Nodes (16): applyConfiguration(), el, inspectDirectory(), loadCatalog(), renderFileTree(), renderSkillsList(), runTerminalCommand(), setDefaultTargetDir() (+8 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (16): author, dependencies, cors, express, description, keywords, license, main (+8 more)

### Community 2 - "server.js"
Cohesion: 0.28
Nodes (13): generateConfig(), generateGlobalInstallScript(), generateSetupScript(), AGENT_SKILLS, DESIGN_MD_PRESETS, DESIGN_SKILLS, GRAPHIFY_TEMPLATES, PONYTAIL_RULES (+5 more)

### Community 3 - "installer.js"
Cohesion: 0.43
Nodes (7): checkBinary(), detectEnvironment(), execAsync, executeCommandStreaming(), inspectProjectPath(), resolveUserPath(), writeFilesToProject()

### Community 4 - "AGENTS.md"
Cohesion: 0.33
Nodes (5): Commit Message Conventions, Graphify Architectural Guidance, Ponytail, lazy senior dev mode, TypeScript & Node.js Standards, Verification & Testing Standard

### Community 5 - "CLAUDE.md"
Cohesion: 0.33
Nodes (5): Commit Message Conventions, Graphify Architectural Guidance, Ponytail, lazy senior dev mode, TypeScript & Node.js Standards, Verification & Testing Standard

### Community 6 - "GEMINI.md"
Cohesion: 0.33
Nodes (5): Commit Message Conventions, Graphify Architectural Guidance, Ponytail, lazy senior dev mode, TypeScript & Node.js Standards, Verification & Testing Standard

### Community 7 - "AI Agent Project Configurator (Web & CLI)"
Cohesion: 0.40
Nodes (4): AI Agent Project Configurator (Web & CLI), 📁 Fișiere Generate într-un Proiect Țintă, 🚀 Pornire Rapidă, ⚙️ Structura Aplicației

### Community 8 - "Graphify Knowledge Graph Skill"
Cohesion: 0.50
Nodes (3): Best Practices, Commands, Graphify Knowledge Graph Skill

### Community 9 - "Spec-Driven Development"
Cohesion: 0.50
Nodes (3): 1. Specification Checklist, 2. Process, Spec-Driven Development

### Community 10 - "Graphify Knowledge Graph Skill"
Cohesion: 0.50
Nodes (3): Best Practices, Commands, Graphify Knowledge Graph Skill

### Community 11 - "Spec-Driven Development"
Cohesion: 0.50
Nodes (3): 1. Specification Checklist, 2. Process, Spec-Driven Development

## Knowledge Gaps
- **62 isolated node(s):** `el`, `state`, `author`, `cors`, `express` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 91 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cors` connect `package.json` to `server.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `express` connect `package.json` to `server.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `el`, `state`, `author` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._