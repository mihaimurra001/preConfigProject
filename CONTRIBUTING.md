# Ghid de Contribuție / Contributing Guide

Vă mulțumim pentru interesul de a contribui la **AI Agent Project Configurator**!  
Acest proiect este conceput ca o platformă open-source dedicată comunității de ingineri software și dezvoltatorilor care lucrează cu agenți autonomi de codare ([Google Antigravity `agy`](https://github.com/google/antigravity) și [Anthropic Claude Code](https://claude.ai/code)).

---

## 🛠️ Dezvoltare Locală (Local Development Setup)

### 1. Clonare și instalare
```bash
git clone https://github.com/mihaimurra001/preConfigProject.git
cd preConfigProject
npm install
```

### 2. Rularea aplicației
```bash
# Mod normal de producție:
npm start

# Sau mod de dezvoltare cu auto-reload la modificarea fișierelor:
npm run dev
```
Aplicația va fi disponibilă la: **`http://localhost:3030`**.

### 3. Rularea testelor automate
```bash
npm test
```
Testele folosesc test runner-ul nativ Node.js (`node --test`), asigurând verificarea integrității catalogului de skills, a temelor și a motorului de generare de configurații.

---

## 🧩 Structura Proiectului (Architecture)

```
preConfigProject/
├── lib/
│   ├── generator.js        # Motorul care generează fișierele (.agents/, .claude/, AGENTS.md, etc.)
│   ├── skills-catalog.js   # Catalogul de skills, reguli și preseturi pentru agenți
│   ├── themes-catalog.js   # Catalogul de teme DESIGN.md (palete, fonturi, reguli UI)
│   └── installer.js        # Utilitare pentru scrierea pe disc și execuție comenzi
├── public/
│   ├── index.html          # Interfața Web UI principală
│   ├── app.js              # Logica frontend-ului (interacțiuni, fetch API, preview)
│   ├── style.css           # Stiluri custom & animații
│   └── themes-data.js      # Datele vizuale ale temelor pentru galeria web
├── tests/
│   └── config-generator.test.js  # Teste unitare automate
├── server.js               # Serverul Express (REST API + SSE terminal streaming)
└── setup-ai-environment.sh # Script automat pentru instalarea uneltelor globale
```

---

## 💡 Cum poți contribui? (How to Contribute)

### 1. Adăugarea unui nou Skill pentru Agenți
Toate skill-urile sunt definite în [`lib/skills-catalog.js`](lib/skills-catalog.js):
- Adaugă definiția skill-ului în array-ul corespunzător (`AGENT_SKILLS`, `CYBERSECURITY_SKILLS`, sau `DESIGN_SKILLS`).
- Include:
  - `id`: identificator unic kebab-case (ex: `my-awesome-skill`).
  - `name`: numele directorului în `.agents/skills/<name>/SKILL.md`.
  - `title`: titlul vizibil în UI.
  - `command`: comanda rapidă (ex: `/my-skill`).
  - `content`: instrucțiunile markdown complete ale skill-ului cu frontmatter YAML.

### 2. Adăugarea unei Teme noi în DESIGN.md
Galeria de teme este în [`lib/themes-catalog.js`](lib/themes-catalog.js) și reflectată în [`public/themes-data.js`](public/themes-data.js):
- Fiecare temă conține: `id`, `name`, `brand`, `tag`, `accent`, `canvas`, `surface`, `border`, `text`, `textMuted`, `font`, `fontFamily`, `radius`, `description` și `principles`.

### 3. Îmbunătățirea generatorului de fișiere
Logica de asamblare a fișierelor de configurare se află în [`lib/generator.js`](lib/generator.js).  
Asigură-te că orice modificare este acoperită de teste în `tests/`.

---

## 📐 Convenții de Cod & Calitate (Guidelines)

- **Standarde JavaScript & Node**: Folosim ESM (`import`/`export`), strict error handling cu `try/catch` și async/await.
- **Ponytail principle (Minimalism & Eficiență)**: Nu adăugăm librării npm greoaie dacă funcționalitatea poate fi realizată cu modulele native Node.js sau API-urile standard ale browserului.
- **Securitate**: Nu introduceți căi hardcodate locale (de exemplu căi absolute specifice utilizatorului) sau secrete.
- **Conventional Commits**: Folosiți formate standard pentru mesajele de commit:
  - `feat:` pentru funcționalități noi
  - `fix:` pentru rezolvarea de bug-uri
  - `docs:` pentru actualizări de documentație
  - `test:` pentru teste adăugate sau corectate
  - `refactor:` pentru optimizarea codului fără schimbarea comportamentului
  - `chore:` pentru mentenanță și configurări

---

## 🚀 Procesul de Pull Request (PR)

1. Fă un **Fork** la repository.
2. Creează o ramură nouă din `main`:
   ```bash
   git checkout -b feat/numele-functionalitatii
   ```
3. Fă modificările necesare și rulează testele:
   ```bash
   npm test
   ```
4. Fă commit folosind **Conventional Commits**:
   ```bash
   git commit -m "feat: add new database migration architect skill"
   ```
5. Trimite modificările în fork-ul tău (`git push origin feat/numele-functionalitatii`).
6. Deschide un **Pull Request** pe branch-ul `main` al repo-ului oficial.

---

Mulțumim pentru sprijin și codare plăcută alături de agenții AI! 🤖✨
