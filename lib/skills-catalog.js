// lib/skills-catalog.js - Catalog of skills, rules, and plugins

export const AGENT_SKILLS = [
  {
    id: "spec-driven-development",
    name: "spec-driven-development",
    title: "Spec-Driven Development",
    command: "/spec",
    category: "define",
    description: "Spec before code. Guides the user to formulate unambiguous requirements, interface boundaries, and acceptance criteria.",
    content: `---
name: spec-driven-development
description: Use when defining new features or user requests before writing code. Enforces specification, interface boundaries, and explicit acceptance criteria.
---

# Spec-Driven Development

Before writing production code, define the specification:

## 1. Specification Checklist
- **Goal**: What problem are we solving?
- **Scope & Non-Goals**: Explicitly state what is out of scope.
- **Interfaces**: Data shapes, API signatures, inputs/outputs.
- **Acceptance Criteria**: Concrete verifiable conditions of done.
- **Edge Cases**: Error handling, timeouts, malformed inputs.

## 2. Process
1. Query the user or review requirements to fill open questions.
2. Produce a concise SPECIFICATION document or proposal.
3. Obtain user confirmation before proceeding to planning or coding.`
  },
  {
    id: "planning-and-task-breakdown",
    name: "planning-and-task-breakdown",
    title: "Atomic Planning & Task Breakdown",
    command: "/plan",
    category: "plan",
    description: "Breaks down approved specs into small, verifiable, atomic tasks with clear dependencies.",
    content: `---
name: planning-and-task-breakdown
description: Use when planning an implementation from a specification. Breaks work into small, atomic, verifiable steps.
---

# Planning & Task Breakdown

Transform a specification into an ordered list of atomic implementation steps:

## Principles
- **Atomicity**: Each task represents a single verifiable increment.
- **Verification First**: Every step must define how it will be tested.
- **Dependency Graph**: Clear sequential vs parallel task identification.
- **Rollback Safety**: If a step fails, state remains clean.`
  },
  {
    id: "incremental-implementation",
    name: "incremental-implementation",
    title: "Incremental Implementation",
    command: "/build",
    category: "build",
    description: "One vertical slice at a time. Write code incrementally, verifying each slice before proceeding.",
    content: `---
name: incremental-implementation
description: Use during active code construction. Implements features slice-by-slice, verifying each step.
---

# Incremental Implementation

Build features vertically and incrementally:

## Workflow
1. Select the next atomic task from the plan.
2. Implement only what is required for that slice.
3. Run existing and new tests to ensure zero regressions.
4. Commit or milestone the change before moving forward.`
  },
  {
    id: "test-driven-development",
    name: "test-driven-development",
    title: "Test-Driven Development (TDD)",
    command: "/test",
    category: "verify",
    description: "Red-Green-Refactor cycle. Tests are proof of functionality. Never write implementation without a failing test first.",
    content: `---
name: test-driven-development
description: Use when implementing logic, bug fixes, or new endpoints. Enforces the Red-Green-Refactor loop.
---

# Test-Driven Development (TDD)

1. **Red**: Write a failing test demonstrating the desired behavior or reproducing the reported bug.
2. **Green**: Write the simplest possible code to make the test pass.
3. **Refactor**: Clean up the implementation while keeping all tests passing.
4. Verify edge cases and error handling.`
  },
  {
    id: "constraint-driven-development",
    name: "constraint-driven-development",
    title: "Constraints & Quality Bar",
    command: "/constraints",
    category: "define",
    description: "Decide once, enforce everywhere. Locks down performance budgets, architectural boundaries, and lint standards.",
    content: `---
name: constraint-driven-development
description: Use to establish or audit architectural constraints, security boundaries, and performance budgets.
---

# Constraint-Driven Development

Establish immovable constraints early:
- Memory & Bundle Size Budgets
- Latency & Query Limits (e.g. max N queries per HTTP request)
- Security Trust Boundaries (no unvalidated input past gateway)
- Zero new circular dependencies`
  },
  {
    id: "code-review-and-quality",
    name: "code-review-and-quality",
    title: "5-Axis Code Review",
    command: "/review",
    category: "review",
    description: "Five-axis review before merge: correctness, architecture, security, performance, and readability.",
    content: `---
name: code-review-and-quality
description: Use before merging, committing, or closing a task. Performs an objective 5-axis review of changes.
---

# 5-Axis Code Review

Evaluate all changed code across 5 distinct axes:
1. **Correctness**: Does the code fulfill the spec without bugs or edge-case oversights?
2. **Architecture**: Does it adhere to project patterns, avoiding tight coupling or leaky abstractions?
3. **Security**: Sanitization, authorization checks, secret leakage, safe dependencies.
4. **Performance**: Algorithmic complexity, unnecessary allocations, blocking I/O.
5. **Readability & Maintainability**: Clear naming, self-documenting code, no dead code.`
  },
  {
    id: "performance-optimization",
    name: "performance-optimization",
    title: "Performance Optimization (WebPerf)",
    command: "/webperf",
    category: "verify",
    description: "Measure before you optimize. Profiles bottlenecks, Core Web Vitals, and algorithmic efficiency.",
    content: `---
name: performance-optimization
description: Use when diagnosing slow workflows, optimizing queries, or auditing web performance.
---

# Performance Optimization

- Never optimize based on conjecture: measure baseline metrics first.
- Profile CPU, memory allocations, and network roundtrips.
- Identify hot paths, N+1 queries, unindexed searches, or excessive bundle payloads.
- Re-measure after changes to quantify actual gain.`
  },
  {
    id: "code-simplification",
    name: "code-simplification",
    title: "Code Simplification",
    command: "/code-simplify",
    category: "review",
    description: "Clarity over cleverness. Strips out speculative abstractions, reduces indentation, and deletes redundant boilerplate.",
    content: `---
name: code-simplification
description: Use to refactor overly complex code, remove dead code, and reduce cognitive load.
---

# Code Simplification

- Reduce cyclomatic complexity and deeply nested conditionals.
- Eliminate premature generalizations and single-use abstraction layers.
- Prefer explicit, standard-library constructs over custom magic.`
  },
  {
    id: "shipping-and-launch",
    name: "shipping-and-launch",
    title: "Shipping & Production Launch",
    command: "/ship",
    category: "ship",
    description: "Pre-flight checks, automated migrations, release notes, and deployment safety gates.",
    content: `---
name: shipping-and-launch
description: Use when preparing a release, merging to main branch, or deploying to production.
---

# Shipping & Production Launch

1. Check CI/CD status and test suite completion.
2. Confirm database migrations are backwards-compatible.
3. Verify environment variables and configuration secrets.
4. Review changelog and semver tag.`
  },
  {
    id: "interview-me",
    name: "interview-me",
    title: "Requirements Interrogation (Interview Me)",
    command: "/interview-me",
    category: "define",
    description: "Interrogates requirements one focused question at a time to clarify ambiguous specifications.",
    content: `---
name: interview-me
description: Use when user requirements are vague or underspecified. Prompts the agent to ask targeted questions one by one.
---

# Requirements Interrogation

When a feature request is ambiguous:
- Do NOT make silent assumptions.
- Ask 1 to 3 targeted, high-leverage questions to clarify user intent, tech constraints, and scope.
- Wait for user response before proposing implementation.`
  },
  {
    id: "api-and-interface-design",
    name: "api-and-interface-design",
    title: "API & Interface Design",
    command: "/api-design",
    category: "build",
    description: "Designs predictable, type-safe REST, GraphQL, or RPC APIs following industry best practices.",
    content: `---
name: api-and-interface-design
description: Use when designing or changing public interfaces, REST routes, GraphQL schemas, or internal service APIs.
---

# API & Interface Design

- Consistency in resource naming, HTTP status codes, and error envelopes.
- Idempotency for mutating operations where appropriate.
- Versioning and non-breaking evolutionary changes.
- Explicit schema definitions with input validation.`
  },
  {
    id: "debugging-and-error-recovery",
    name: "debugging-and-error-recovery",
    title: "Systematic Debugging & Error Recovery",
    command: "/debug",
    category: "verify",
    description: "Root-cause analysis, reproducible test cases, and defense-in-depth error containment.",
    content: `---
name: debugging-and-error-recovery
description: Use when encountering tricky bugs, stack traces, or recurring crashes.
---

# Systematic Debugging

1. **Reproduce**: Create a minimal reproducible test case.
2. **Isolate**: Formulate hypotheses, inspect stack traces, and eliminate variables.
3. **Fix the Root Cause**: Do not bandage symptoms at caller sites; fix the underlying flaw.
4. **Prevent**: Leave a regression test in the test suite.`
  }
];

export const PONYTAIL_RULES = {
  lite: `# Ponytail (Lite Mode) - Lazy Senior Dev Rules
- Write minimum code that works.
- Prefer existing codebase patterns and helpers before creating new ones.
- Question unnecessary dependencies.
- Fix root causes, not symptoms.`,

  full: `# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse the helper, util, or pattern that's already here, don't re-write it.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it (e.g. <input type="date"> over flatpickr).
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

The ladder runs after you understand the problem, not instead of it: read the task and the code it touches, trace the real flow end to end, then climb.

Bug fix = root cause, not symptom: a report names a symptom. Grep every caller of the function you touch and fix the shared function once.

Rules:
- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, but only once you understand the problem.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Mark deliberate simplifications that cut a real corner with a \`ponytail:\` comment.`,

  ultra: `# Ponytail (Ultra Mode) - Extreme Minimalism

You are the ultimate lazy senior developer. Every line of code is technical debt.

Zero-Tolerance Rules:
1. Hard reject any speculative architecture, premature generalization, or unnecessary wrapper class.
2. Under no circumstances add a new dependency without user's explicit permission.
3. If the browser or runtime standard library has a built-in method, use it immediately.
4. If a task can be solved by deleting unused code or refactoring 3 lines, do that.
5. Every single change must be justified by the smallest possible diff.`
};

export const PONYTAIL_SKILLS = [
  {
    name: "ponytail-review",
    title: "Ponytail Diff Review",
    description: "Reviews git diffs or proposed code to aggressively strip unneeded lines, boilerplate, and dependencies.",
    content: `---
name: ponytail-review
description: Review changes like a lazy senior dev. Flags over-engineering, unneeded abstractions, new dependencies, and boilerplate.
---

# Ponytail Code Review

Review the current diff or implementation:
1. Did we add code that isn't strictly necessary?
2. Are there wrappers, interfaces, or factories where a direct call was enough?
3. Did we install an npm/pip package for something 3 lines of stdlib could do?
4. Suggest deletions and one-line replacements.`
  },
  {
    name: "ponytail-audit",
    title: "Ponytail Dependency & Bloat Audit",
    description: "Audits the project's dependencies and identifies packages that can be replaced by native runtime APIs.",
    content: `---
name: ponytail-audit
description: Audits project dependencies and code bloat, recommending native replacements and removals.
---

# Ponytail Dependency Audit

Inspect \`package.json\`, \`requirements.txt\`, or \`go.mod\`:
1. Identify utility packages that modern runtimes already provide (e.g., lodash functions, left-pad, is-promise, date formatters).
2. Recommend concrete steps to uninstall them and replace with native code.`
  }
];

export const GRAPHIFY_TEMPLATES = {
  skill: `---
name: graphify
description: Turn any codebase, with docs, SQL schemas, and configs, into a queryable knowledge graph. Query architecture and cross-file connections with minimal token consumption.
---

# Graphify Knowledge Graph Skill

Use this skill to inspect cross-file dependencies, architectural flows, and high-level structure without brute-force grep or reading dozens of files.

## Commands
- \`/graphify .\` : Build or rebuild the knowledge graph for current directory.
- \`/graphify query "<question>"\` : Query the knowledge graph.
- \`/graphify path "<source>" "<target>"\` : Find shortest connection path between two symbols.
- \`/graphify explain "<symbol>"\` : Explain relationships for a class, function, or component.

## Best Practices
- Before answering broad codebase architecture questions, query the graph first to identify relevant files, saving 70x tokens.
- Review \`graphify-out/GRAPH_REPORT.md\` for central hub nodes and structural insights.`,

  rule: `# Graphify Architectural Guidance

- Before performing deep exploration across multiple unfamiliar files, check if \`graphify-out/graph.json\` exists.
- If the knowledge graph is available, query it or use the graphify MCP server tools to identify caller hierarchies and dependency pathways.
- Re-run \`/graphify .\` whenever major structural changes or schema migrations take place.`,

  workflow: `---
name: graphify-workflow
description: Automated workflow to index and inspect codebase architecture.
---

# Graphify Workflow

1. Check if graph exists in \`graphify-out/graph.json\`.
2. If missing or out of date, run \`graphify .\`.
3. Consult \`graphify-out/GRAPH_REPORT.md\` for critical dependencies.`,

  mcpConfigSnippet: {
    command: "uv",
    args: [
      "run",
      "--with",
      "graphifyy",
      "--with",
      "mcp",
      "-m",
      "graphify.serve",
      "${workspace.path}/graphify-out/graph.json"
    ]
  }
};

export const STACK_PRESETS = {
  general: `# General Engineering Standards
- Follow standard formatting and linting rules.
- Maintain atomic commits with clear descriptions.
- Ensure all tests pass before completing tasks.`,

  typescript: `# TypeScript & Node.js Standards
- Strict type checking enabled (no explicit 'any' without documented justification).
- ESM imports with standard extensions where required.
- Handle Promises with async/await and structured error handling.
- Unit tests co-located or under \`tests/\` using Vitest / Jest.`,

  python: `# Python Standards
- Python 3.10+ typing annotations on all public functions.
- Adhere to PEP 8 conventions.
- Use pytest for automated testing.
- Isolate environment using uv, poetry, or venv.`,

  react: `# React & Next.js Standards
- Functional components with React hooks.
- Server Components by default in Next.js App Router; use 'use client' only when state/effects are required.
- Keep components small and focused on a single responsibility.
- Accessible HTML semantics and responsive design.`,

  go: `# Go Standards
- Standard Go conventions (\`gofmt\`, idiomatic error handling returning \`(result, err)\`).
- Explicit context passing for network and database operations.
- Table-driven tests with standard \`testing\` package.`,

  rust: `# Rust Standards
- Leverage the type system and Result/Option for error propagation.
- Minimize \`unsafe\` blocks and document rationale if unavoidable.
- Follow standard Cargo layout and run \`cargo clippy\` regularly.`
};

export const DESIGN_SKILLS = [
  {
    id: "design-taste-frontend",
    name: "design-taste-frontend",
    title: "Taste Skill (Anti-Slop Frontend)",
    repo: "Leonxlnx/taste-skill",
    stars: "86k+",
    command: "/taste",
    description: "Stops AI from generating boring, generic, purple-gradient template slop. Enforces real design direction and the Three Dials.",
    content: `---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, web apps, and redesigns. Infers design direction, enforces real design systems, and prevents generic AI aesthetic.
---

# Taste Skill: Anti-Slop Frontend Engineering

Before generating UI or tweaking CSS, apply the **Anti-Default Discipline**:

## 1. Anti-Default Rules
- **NO Generic AI Tells**: Do NOT default to AI-purple gradients, centered hero over dark mesh, 3 identical feature cards, generic glassmorphism, or Inter + slate-900.
- **The Three Dials**:
  - \`DESIGN_VARIANCE\` (1 = Strict Symmetry, 10 = High Editorial / Expressive)
  - \`MOTION_INTENSITY\` (1 = Static / Restrained, 10 = Fluid Physics)
  - \`VISUAL_DENSITY\` (1 = Airy / Gallery, 10 = Information-Dense Dashboard)
- **Design Read First**: Declare a 1-line design read before coding: *"Reading this as: [page kind] for [audience], with [vibe] language, leaning toward [design system]."*`
  },
  {
    id: "impeccable",
    name: "impeccable",
    title: "Impeccable (Design Language & 23 Commands)",
    repo: "pbakaus/impeccable",
    stars: "67k+",
    command: "/impeccable",
    description: "Paul Bakaus's design language for AI agents: 23 commands (craft, critique, audit, polish, bolder, quieter, animate) and PRODUCT.md truth.",
    content: `---
name: impeccable
description: Professional design guidance for AI coding agents. 23 commands, visual iteration, and deterministic detector rules for frontend design.
---

# Impeccable Design Language

Use when crafting or refining user interfaces.

## Core Commands
- \`/impeccable init\` : One-time setup: inspects project and creates \`PRODUCT.md\` to preserve durable product truth.
- \`/impeccable craft\` : Full shape-then-build flow with visual iteration.
- \`/impeccable critique\` : UX/UI review: visual hierarchy, clarity, emotional resonance.
- \`/impeccable audit\` : Technical quality checks (WCAG 2.2 accessibility, responsive layout, performance).
- \`/impeccable polish\` : Final alignment pass and shipping readiness.
- \`/impeccable bolder\` / \`/impeccable quieter\` : Adjust visual volume dynamically.
- \`/impeccable animate\` : Add purposeful motion.`
  },
  {
    id: "emil-design-eng",
    name: "emil-design-eng",
    title: "Emil Kowalski - Design Engineering & Motion",
    repo: "emilkowalski/skills",
    stars: "37k+",
    command: "/emil-design",
    description: "Vercel & Linear design engineering standards: natural easing curves, spring physics, proper duration, and subtle shadows.",
    content: `---
name: emil-design-eng
description: Professional interaction design, fluid animations, and micro-interactions by Emil Kowalski (Linear & Vercel).
---

# Emil Kowalski: Design Engineering & Motion

## Golden Rules for UI Motion
1. **Never use \`ease-in\` for entering elements.** Elements entering the viewport must use \`ease-out\` (decelerating) so they start fast and settle gently.
2. **Spring Physics over Linear Durations**: Interactive elements (buttons, modals, sheets) feel tactile when driven by spring curves (\`stiffness: 300, damping: 30\`).
3. **Subtle Shadows over Harsh Borders**: Use multi-layer, semi-transparent box-shadows (\`rgba(0,0,0,0.06)\` to \`rgba(0,0,0,0.12)\`) instead of thick solid borders.
4. **Duration Budget**: Micro-interactions must complete in 150ms–250ms. Never make users wait for decorative animations.`
  },
  {
    id: "animate",
    name: "animate",
    title: "Emil Kowalski - Animate from Scratch",
    repo: "emilkowalski/skills",
    stars: "37k+",
    command: "/animate",
    description: "Constructs fluid, 60fps animations with proper CSS transitions or Framer Motion properties.",
    content: `---
name: animate
description: Build fluid, performant animations from scratch choosing the correct curve, duration, properties, and hardware acceleration.
---

# Fluid Animation Skill

- **Animate only \`transform\` and \`opacity\`**: Avoid animating \`height\`, \`width\`, \`top\`, or \`margin\` which trigger browser layout reflow.
- **Respect \`prefers-reduced-motion\`**: Always wrap motion with accessible media queries.
- **Exit fast, enter smooth**: Exit animations should be 20-30% faster than entry animations.`
  }
];

export const DESIGN_MD_PRESETS = {
  linear: `---
version: 1.0
name: Linear-Design-System
description: Near-black product-focused canvas with subtle hairline borders, lavender-blue accent, and high-density craft.
---

# Design System: Linear

## 1. Palette
- **Canvas (Background)**: \`#010102\`
- **Surface 1 (Panels/Cards)**: \`#0f1011\`
- **Surface 2 (Elevated)**: \`#141516\`
- **Primary Accent**: \`#5e6ad2\` (Lavender-Blue, used with restraint)
- **Primary Hover**: \`#828fff\`
- **Hairline Border**: \`#23252a\`
- **Hairline Strong**: \`#34343a\`
- **Text Primary**: \`#f7f8f8\`
- **Text Muted**: \`#8a8f98\`

## 2. Typography & Hierarchy
- Font Family: Inter, SF Pro Display, or Geist Sans
- Tracking: Negative letter-spacing on display headings (-0.02em to -0.04em)
- Dense, technical, quietly luxurious

## 3. Surface & Radii
- Border Radius: 8px for cards, 6px for buttons/inputs, 4px for badges
- Borders: 1px hairline borders (\`#23252a\`), avoid heavy drop-shadows
- Micro-interactions: 150ms ease-out transitions`,

  apple: `---
version: 1.0
name: Apple-HIG-Design-System
description: Clean, content-forward, humanist design with refined typography, tactile feedback, and subtle depth.
---

# Design System: Apple Human Interface Guidelines

## 1. Palette
- **Light Background**: \`#ffffff\` / \`#f5f5f7\`
- **Dark Background**: \`#000000\` / \`#1c1c1e\`
- **Accent Blue**: \`#0071e3\`
- **System Gray**: \`#86868b\`
- **Card Surface**: Ultra-thin background blur (\`backdrop-filter: blur(20px)\`)

## 2. Typography
- Font Family: -apple-system, BlinkMacSystemFont, "SF Pro", sans-serif
- Hierarchy: Large Title (34px bold), Title 1 (28px), Title 2 (22px), Body (17px regular)

## 3. Principles
- Fluidity, content-first clarity, generous breathing room, rounded corners (12px to 16px).`,

  stripe: `---
version: 1.0
name: Stripe-Design-System
description: High-trust fintech aesthetic with vibrant color accents, crisp cards, and immaculate precision.
---

# Design System: Stripe

## 1. Palette
- **Background**: \`#f8f9fa\` (or dark mode \`#0a2540\`)
- **Card Background**: \`#ffffff\`
- **Primary Brand**: \`#635bff\` (Indigo)
- **Text Ink**: \`#0a2540\`
- **Text Secondary**: \`#425466\`
- **Border**: \`#e6ebf1\`

## 2. Elevation & Shadows
- Layered shadow: \`0 13px 27px -5px rgba(50,50,93,0.25), 0 8px 16px -8px rgba(0,0,0,0.3)\`
- Border Radius: 8px to 12px`,

  vercel: `---
version: 1.0
name: Vercel-Geist-Design-System
description: Stark monochrome high-contrast aesthetic with geometric precision and Geist typography.
---

# Design System: Vercel

## 1. Palette
- **Canvas**: \`#000000\`
- **Foreground**: \`#ffffff\`
- **Gray-100**: \`#111111\`
- **Gray-200**: \`#333333\`
- **Gray-500**: \`#888888\`
- **Accent**: Pure Monochrome or Electric Blue (\`#0070f3\`)

## 2. Typography
- Font Family: "Geist Sans", monospace for technical values with "Geist Mono"
- Border Radius: 6px standard, 9999px for pills`,

  github: `---
version: 1.0
name: GitHub-Primer-Design-System
description: Developer-centric telemetry aesthetic with high visual separation, status indicators, and dark muted canvas.
---

# Design System: GitHub Primer

## 1. Palette
- **Canvas (Background)**: \`#0d1117\`
- **Surface (Card/Box)**: \`#161b22\`
- **Subtle Surface**: \`#21262d\`
- **Border Hairline**: \`#30363d\`
- **Accent Green**: \`#238636\` (Primary Actions & Merges)
- **Accent Blue**: \`#58a6ff\` (Links & Focus Rings)
- **Text Primary**: \`#e6edf3\`
- **Text Muted**: \`#848d97\`

## 2. Typography
- Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif
- Code Monospace: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace
- Border Radius: 6px standard, 3px for pills & counter badges`,

  supabase: `---
version: 1.0
name: Supabase-Emerald-Design-System
description: High-contrast developer backend aesthetic with vibrant radiant emerald green, deep obsidian surfaces, and SQL telemetry.
---

# Design System: Supabase

## 1. Palette
- **Canvas**: \`#171717\`
- **Surface / Panels**: \`#1c1c1c\`
- **Elevated Border**: \`#2e2e2e\`
- **Primary Emerald**: \`#3ecf8e\`
- **Emerald Glow**: \`rgba(62, 207, 142, 0.15)\`
- **Text Bright**: \`#ededed\`
- **Text Secondary**: \`#8a8a8a\`

## 2. Typography & Code
- Font Family: Circular, "Fira Code", monospace for keys & tokens
- Border Radius: 6px standard
- Glow Effects: Subtle emerald borders on active/focus state`,

  raycast: `---
version: 1.0
name: Raycast-Launcher-Design-System
description: Hyper-responsive launcher UI with ruby red accents, frosted dark glass surfaces, and keyboard-first telemetry.
---

# Design System: Raycast

## 1. Palette
- **Canvas / Backdrop**: \`#141416\`
- **Surface (Glass / Frost)**: \`#1f1f23\` with \`backdrop-filter: blur(24px)\`
- **Hairline Border**: \`#2c2c32\`
- **Accent Ruby Red**: \`#ff6363\`
- **HotKey Badge BG**: \`#2e2e34\`
- **Text Bright**: \`#ffffff\`
- **Text Muted**: \`#93939f\`

## 2. Micro-Interactions
- Border Radius: 8px to 10px
- Hotkey KBD chips: 4px rounded, 11px font
- Transitions: Under 100ms ease-out for immediate feedback`,

  tailwind: `---
version: 1.0
name: Tailwind-CSS-Design-System
description: Modern clean utility-first web aesthetic with slate neutrals, vibrant sky blue, and balanced modular geometry.
---

# Design System: Tailwind CSS

## 1. Palette
- **Slate Canvas**: \`#0f172a\` (or light \`#f8fafc\`)
- **Slate Surface**: \`#1e293b\` (or light \`#ffffff\`)
- **Slate Border**: \`#334155\` (or light \`#e2e8f0\`)
- **Primary Sky**: \`#0ea5e9\`
- **Text Primary**: \`#f8fafc\` (or light \`#0f172a\`)
- **Text Muted**: \`#94a3b8\` (or light \`#64748b\`)

## 2. Geometry
- 4px modular spacing scale (p-4, gap-4, m-2)
- Border Radius: 8px (rounded-md) to 12px (rounded-lg)`,

  notion: `---
version: 1.0
name: Notion-Editorial-Design-System
description: Minimalist warm paper aesthetic with sepia borders, literary typography, and distraction-free workspace clarity.
---

# Design System: Notion

## 1. Palette
- **Warm Canvas**: \`#f7f6f3\` (or warm dark \`#202020\`)
- **Card Surface**: \`#ffffff\` (or warm dark \`#2f3437\`)
- **Sepia Border**: \`#e3e2de\` (or warm dark \`#373c3f\`)
- **Accent Blue**: \`#2eaadc\`
- **Text Primary**: \`#37352f\` (or dark \`#d4d4d4\`)
- **Text Muted**: \`#787774\`

## 2. Typography
- Font Family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica
- Headings: Optional editorial serif styling for title hierarchy
- Border Radius: 4px to 6px, restrained and calm`,

  figma: `---
version: 1.0
name: Figma-Creative-Design-System
description: Pro creative workspace UI with neutral tool canvas, electric purple accents, and high-density inspector toolbars.
---

# Design System: Figma

## 1. Palette
- **Canvas / Viewport**: \`#1e1e1e\`
- **Panels / Toolbars**: \`#2c2c2c\`
- **Subtle Border**: \`#383838\`
- **Accent Purple**: \`#7b61ff\`
- **Hover Surface**: \`#383838\`
- **Text Pure**: \`#ffffff\`
- **Text Dim**: \`#b3b3b3\`

## 2. Tool Panels
- Border Radius: 6px on floating bars and inputs
- Highly dense 24px and 32px tool heights
- Strict neutral gray palette so user content shines without color bias`,

  openai: `---
version: 1.0
name: OpenAI-ChatGPT-Design-System
description: AI conversational clarity with slate surfaces, mint green accents, generous reading widths, and fluid cards.
---

# Design System: OpenAI ChatGPT

## 1. Palette
- **Dark Canvas**: \`#202123\`
- **Surface / Bubble**: \`#343541\`
- **Hairline Border**: \`#4d4d4f\`
- **Mint Green Accent**: \`#10a37f\`
- **Text High Contrast**: \`#ececf1\`
- **Text Subtext**: \`#c5c5d2\`

## 2. Layout & Typography
- Font Family: Söhne, ui-sans-serif, system-ui, -apple-system
- Reading Column: Max 768px reading container for optimal eye-tracking
- Border Radius: 8px to 12px for message containers`,

  airbnb: `---
version: 1.0
name: Airbnb-Design-System
description: High-trust consumer marketplace aesthetic with iconic rausch coral, generous rounded cards, and diffuse soft shadows.
---

# Design System: Airbnb

## 1. Palette
- **Canvas**: \`#ffffff\`
- **Card Surface**: \`#f7f7f7\`
- **Primary Rausch Coral**: \`#ff385c\`
- **Border**: \`#dddddd\`
- **Text Ink**: \`#222222\`
- **Text Gray**: \`#717171\`

## 2. Surface & Feel
- Border Radius: 12px to 16px (rounded-xl)
- Soft Diffuse Shadows: \`0 6px 20px rgba(0,0,0,0.08)\`
- Approachable, high-trust consumer feel`,

  configurator: `---
version: 1.0
name: AI-Agent-Configurator-Architectural-System
description: Modern architectural light design system: pure white and deep charcoal with 2px sharp tactile edges, 40px grid matrix, Plus Jakarta Sans, and emerald status telemetry.
---

# Design System: AI Agent Configurator (Architectural Light)

## 1. Palette & Surface Depth
- **Canvas / Background**: \`#fbfbfd\` (Airy architectural white with 40px hairline grid)
- **Primary Card Surface**: \`#ffffff\` (Sharp glass card with 1px border)
- **Subtle Surface**: \`#f4f4f6\`
- **Surface Hover**: \`#eaecee\`
- **Border Default**: \`#dcdfe4\` (Crisp hairline border)
- **Border Hover**: \`#9ca3af\`
- **Accent Primary**: \`#18181b\` / \`#09090b\` (Obsidian Charcoal)
- **Accent Gradient**: \`linear-gradient(135deg, #18181b 0%, #09090b 100%)\`
- **Telemetry Emerald**: \`#10b981\` (Active status dots & success badges)
- **Text Primary**: \`#09090b\` (Deep Jet Black)
- **Text Secondary**: \`#4b5563\` (Refined Slate Gray)

## 2. Typography Hierarchy
- **Sans-Serif**: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace
- Heading Scale:
  - Page Title: 14px font-bold tracking-tight uppercase
  - Section Header: 12px font-bold tracking-wider uppercase
  - Body Text: 12px font-normal leading-relaxed
  - Code / Telemetry: 11px font-mono font-semibold

## 3. Geometry & Border Radius
- **Sharp Radius**: \`2px\` (rounded-sm) — no overly rounded bubbles or blobby corners
- **Square Radius**: \`0px\` for tabs, badges, and technical chips
- **Border**: Strictly \`1px solid\` hairline strokes; zero heavy dark borders

## 4. Interaction & Motion (Emil Kowalski Physics)
- Enter transitions: \`cubic-bezier(0.16, 1, 0.3, 1)\` (fast spring deceleration)
- Duration: 150ms micro-interactions, max 220ms for cards
- Never use \`ease-in\` on entering elements; always decelerate
- Anti-Slop Discipline: Zero generic purple gradients, zero cards-inside-cards, strict visual density.`
};

export const AWESOME_DESIGN_THEMES = [
  {
    id: "configurator",
    name: "Architectural Light",
    brand: "Platforma Curentă",
    tag: "Sharp Monochrome",
    stars: "Craft Standard ⭐",
    accent: "#18181b",
    canvas: "#fbfbfd",
    surface: "#ffffff",
    border: "#dcdfe4",
    text: "#09090b",
    font: "Plus Jakarta Sans / JetBrains Mono",
    radius: "2px sharp, 0px square",
    description: "Design-ul nativ al acestei platforme: cărbune obsidian, carduri albe cu colțuri ascuțite la 2px, rețea tehnică de 40px și telemetrie emerald.",
    principles: ["Muchii ascuțite (2px radius)", "Rețea arhitecturală 40px", "Fizică de resorturi Emil Kowalski"],
    icon: "layers",
    category: "light dev"
  },
  {
    id: "linear",
    name: "Linear",
    brand: "Linear.app",
    tag: "Dark B2B Craft",
    stars: "115k+ ⭐",
    accent: "#5e6ad2",
    canvas: "#010102",
    surface: "#0f1011",
    border: "#23252a",
    text: "#f7f8f8",
    font: "Inter / SF Pro Display (-0.02em)",
    radius: "8px cards, 6px buttons",
    description: "Near-black obsidian canvas cu margini subtile de 1px hairline, accente lavandă folosite cu rigoare și densitate extremă.",
    principles: ["Zero drop-shadows grele", "Negative letter-spacing", "Micro-interacțiuni 150ms"],
    icon: "sliders"
  },
  {
    id: "apple",
    name: "Apple HIG",
    brand: "Apple Inc.",
    tag: "Content-First Clarity",
    stars: "115k+ ⭐",
    accent: "#0071e3",
    canvas: "#f5f5f7",
    surface: "#ffffff",
    border: "#d2d2d7",
    text: "#1d1d1f",
    font: "SF Pro / -apple-system",
    radius: "12px - 16px squircle",
    description: "Claritate umanistă orientată pe conținut, margini rotunjite squircle, spațiere generoasă și fundaluri cu blur ultra-subțire.",
    principles: ["Backdrop blur 20px", "Tipografie dinamică ierarhică", "Feedback haptic & tactil"],
    icon: "command"
  },
  {
    id: "stripe",
    name: "Stripe",
    brand: "Stripe.com",
    tag: "Fintech Precision",
    stars: "115k+ ⭐",
    accent: "#635bff",
    canvas: "#f8f9fa",
    surface: "#ffffff",
    border: "#e6ebf1",
    text: "#0a2540",
    font: "Söhne / Inter, 500-600 weight",
    radius: "8px - 12px",
    description: "Estetică fintech de maximă încredere, accente indigo vibrante, umbre stratificate matematice și carduri impecabile.",
    principles: ["Umbre stratificate pe 2 nivele", "Contururi precise", "Albastru de siguranță financiară"],
    icon: "credit-card"
  },
  {
    id: "vercel",
    name: "Vercel",
    brand: "Vercel.com",
    tag: "Stark Monochrome",
    stars: "115k+ ⭐",
    accent: "#0070f3",
    canvas: "#000000",
    surface: "#111111",
    border: "#333333",
    text: "#ffffff",
    font: "Geist Sans & Geist Mono",
    radius: "6px standard, 9999px pills",
    description: "Contrast maxim alb-negru (monocrom pur), rigoare geometrică absolută, tipografie Geist tehnică și accente albastru electric.",
    principles: ["Contrast WCAG AAA", "Grid tehnic strict", "Geist monospace integrat"],
    icon: "triangle"
  },
  {
    id: "github",
    name: "GitHub Primer",
    brand: "GitHub.com",
    tag: "Dev Telemetry",
    stars: "115k+ ⭐",
    accent: "#238636",
    canvas: "#0d1117",
    surface: "#161b22",
    border: "#30363d",
    text: "#e6edf3",
    font: "-apple-system / Segoe UI",
    radius: "6px standard, 3px badges",
    description: "Sistemul Primer de la GitHub: optimizat pentru programatori, diferențiere vizuală a diff-urilor și culori semantice clare de status.",
    principles: ["Status semantic verde/roșu/galben", "Fundaluri gri închis confortabile", "Tag-uri compacte"],
    icon: "git-branch"
  },
  {
    id: "supabase",
    name: "Supabase",
    brand: "Supabase.com",
    tag: "Emerald Backend",
    stars: "115k+ ⭐",
    accent: "#3ecf8e",
    canvas: "#171717",
    surface: "#1c1c1c",
    border: "#2e2e2e",
    text: "#ededed",
    font: "Circular / Fira Code",
    radius: "6px standard",
    description: "Design întunecat pentru baze de date & SQL: verde smarald neon, suprafețe obsidian și editor monospace integrat.",
    principles: ["Verde smarald radiant", "Tabele de date dense", "Contrast optim pentru cod"],
    icon: "database"
  },
  {
    id: "raycast",
    name: "Raycast",
    brand: "Raycast.com",
    tag: "Keyboard Launcher",
    stars: "115k+ ⭐",
    accent: "#ff6363",
    canvas: "#141416",
    surface: "#1f1f23",
    border: "#2c2c32",
    text: "#ffffff",
    font: "Inter / JetBrains Mono",
    radius: "8px - 10px",
    description: "Viteză fulgerătoare și precizie: accente roșu rubin, indicatoare pentru scurtături de tastatură și sticlă mată întunecată.",
    principles: ["Badge-uri Kbd de taste", "Focalizare rapidă", "Tranziții instant sub 100ms"],
    icon: "zap"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    brand: "TailwindLabs",
    tag: "Modern Utility Web",
    stars: "115k+ ⭐",
    accent: "#0ea5e9",
    canvas: "#0f172a",
    surface: "#1e293b",
    border: "#334155",
    text: "#f8fafc",
    font: "Inter / system-ui",
    radius: "8px rounded-md",
    description: "Estetica oficială modernă Tailwind: nuanțe slate, accente cyan/sky, carduri echilibrate și spațiere modulară armonioasă.",
    principles: ["Paletă Slate & Sky echilibrată", "Scală modulară 4px", "Componente aerisite"],
    icon: "wind"
  },
  {
    id: "notion",
    name: "Notion",
    brand: "Notion.so",
    tag: "Warm Editorial",
    stars: "115k+ ⭐",
    accent: "#2eaadc",
    canvas: "#f7f6f3",
    surface: "#ffffff",
    border: "#e3e2de",
    text: "#37352f",
    font: "ui-sans-serif & Lyon Serif",
    radius: "4px - 6px subtil",
    description: "Spațiu editorial minimalist cu aromă de hârtie caldă, nuanțe sepia, contrast relaxant pentru ochi și tipografie literară.",
    principles: ["Fundal cald ivory", "Linii subțiri sepia", "Fără distracții vizuale"],
    icon: "book-open"
  },
  {
    id: "figma",
    name: "Figma",
    brand: "Figma.com",
    tag: "Creative Canvas",
    stars: "115k+ ⭐",
    accent: "#7b61ff",
    canvas: "#1e1e1e",
    surface: "#2c2c2c",
    border: "#383838",
    text: "#ffffff",
    font: "Inter Display",
    radius: "6px inspector panels",
    description: "Interfață de unelte profesionale de creație: fundal gri neutru pentru a evidenția creația, accent violet și controale numerice precise.",
    principles: ["Panouri flotante compacte", "Accent violet creator", "Feedback vizual la hover pe unelte"],
    icon: "pen-tool"
  },
  {
    id: "openai",
    name: "OpenAI ChatGPT",
    brand: "OpenAI",
    tag: "Conversational Slate",
    stars: "115k+ ⭐",
    accent: "#10a37f",
    canvas: "#202123",
    surface: "#343541",
    border: "#4d4d4f",
    text: "#ececf1",
    font: "Söhne / system-ui",
    radius: "8px - 12px pill",
    description: "Design conversațional axat pe lizibilitate: nuanțe neutre de ardezie (slate), accente mint green și bule de text confortabile.",
    principles: ["Lățime optimă de citire (max 768px)", "Accent verde mentă", "Bule chat fluide"],
    icon: "bot"
  },
  {
    id: "airbnb",
    name: "Airbnb",
    brand: "Airbnb.com",
    tag: "Consumer Trust",
    stars: "115k+ ⭐",
    accent: "#ff385c",
    canvas: "#ffffff",
    surface: "#f7f7f7",
    border: "#dddddd",
    text: "#222222",
    font: "Circular / -apple-system",
    radius: "12px - 16px rounded-xl",
    description: "Estetică de consum prietenoasă cu încredere maximă: accent coral/rausch recunoscut mondial, carduri rotunjite și spațiere confortabilă.",
    principles: ["Rausch Coral emblematic", "Umbre difuze mari", "Rază generoasă de 16px"],
    icon: "home"
  }
];

export const CYBERSECURITY_SKILLS = [
  {
    id: "appsec-code-review",
    name: "appsec-code-review",
    title: "OWASP & AppSec Code Audit",
    command: "/security-audit",
    category: "security",
    stars: "32k+ ⭐",
    repo: "https://github.com/mukul975/Anthropic-Cybersecurity-Skills",
    description: "Audits source code for OWASP Top 10 vulnerabilities: SQLi, XSS, SSRF, IDOR/BOLA, Path Traversal, and Auth flaws.",
    content: `---
name: appsec-code-review
description: Audit source code for OWASP Top 10 security vulnerabilities, injection flaws, authentication weaknesses, and insecure data handling.
---

# Application Security (AppSec) Code Review & Vulnerability Audit

Perform rigorous security auditing against the OWASP Top 10 and CWE standards:

## 1. Vulnerability Checklist
- **Injection (CWE-89, CWE-78)**: Verify all database queries use parameterized prepared statements (never string interpolation). Verify all shell executions sanitize arguments or avoid shell invocation.
- **Cross-Site Scripting (XSS / CWE-79)**: Context-aware output encoding in templates/HTML responses. Safe innerText/textContent instead of innerHTML.
- **Server-Side Request Forgery (SSRF / CWE-918)**: Validate external URLs against allowlists, block private/internal IP ranges (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, AWS metadata 169.254.169.254).
- **Broken Object Level Authorization (BOLA / IDOR / CWE-639)**: Verify the authenticated user owns or is authorized to access the specific requested resource ID.
- **Authentication & Session (CWE-287, CWE-384)**: Strong password hashing (bcrypt, Argon2id), secure session cookies (\`HttpOnly; Secure; SameSite=Strict\`).
- **Path Traversal (CWE-22)**: Resolve user-supplied file paths with strict boundaries; reject \`../\` directory escapes.
- **Insecure Deserialization (CWE-502)**: Avoid native unpickling or untrusted object evaluation.

## 2. Review Process
1. Trace untrusted user input from entry points (HTTP handlers, CLI arguments, webhook payloads) to sinks (DB queries, shell commands, file I/O).
2. Report vulnerabilities with: File & Line, Severity (Critical/High/Medium/Low), CWE identifier, and concrete remediation code.
3. Verify that defenses cannot be bypassed with encoded payloads or alternate casing.`
  },
  {
    id: "threat-modeling",
    name: "threat-modeling",
    title: "STRIDE Threat Modeling",
    command: "/threat-model",
    category: "security",
    stars: "32k+ ⭐",
    repo: "https://github.com/mukul975/Anthropic-Cybersecurity-Skills",
    description: "Deconstructs architecture into trust boundaries, data flows, and threats using the STRIDE methodology.",
    content: `---
name: threat-modeling
description: Analyze software architecture, APIs, and data flows using the STRIDE framework to identify security threats before implementation.
---

# STRIDE Threat Modeling

Before building new services, endpoints, or data models, conduct a structured threat model:

## 1. Deconstruction
- **Assets**: What valuable data or compute power must be protected?
- **Data Flow Diagram (DFD)**: Map processes, data stores, data flows, and external entities.
- **Trust Boundaries**: Identify where data crosses from untrusted to trusted environments (e.g. Browser -> API Gateway -> Database).

## 2. STRIDE Threat Analysis
- **Spoofing**: Can an attacker pretend to be another user, service, or machine? (*Mitigation: Mutual TLS, cryptographic tokens, signed JWTs*).
- **Tampering**: Can data in transit or at rest be modified without detection? (*Mitigation: TLS, HMAC signatures, checksums, immutable logs*).
- **Repudiation**: Can an attacker deny performing an action? (*Mitigation: Secure audit logging with timestamps and tamper-proof storage*).
- **Information Disclosure**: Can sensitive data be read by unauthorized parties? (*Mitigation: Encryption at rest and in transit, redaction of PII*).
- **Denial of Service**: Can resources be exhausted to disrupt availability? (*Mitigation: Rate limiting, timeouts, request payload size limits, pagination*).
- **Elevation of Privilege**: Can an unprivileged user execute admin operations? (*Mitigation: Role-Based Access Control (RBAC), principle of least privilege*).`
  },
  {
    id: "secret-scanning",
    name: "secret-scanning",
    title: "Secret Detection & Sanitization",
    command: "/secret-scan",
    category: "security",
    stars: "17k+ ⭐",
    repo: "https://github.com/NVIDIA/SkillSpector",
    description: "Scans code, configs, git diffs, and logs for leaked credentials, API tokens, private keys, and environment leaks.",
    content: `---
name: secret-scanning
description: Scan codebase, git history, configuration files, and diffs to prevent accidental exposure of secrets and credentials.
---

# Secret Scanning & Credential Protection

Zero tolerance for hardcoded credentials in source control:

## 1. Detection Signatures
- **Cloud Credentials**: AWS Access Keys (\`AKIA...\`), Google Cloud service accounts, Azure client secrets.
- **API Tokens**: GitHub PATs (\`ghp_...\`), OpenAI/Anthropic/Stripe/Twilio API keys.
- **Cryptographic Keys**: RSA/OpenSSH private keys (\`-----BEGIN PRIVATE KEY-----\`), TLS certificates.
- **Connection Strings**: Database URIs containing embedded passwords (\`postgres://user:pass@host/db\`).
- **Sensitive Configs**: Uncommitted \`.env\` files, backup tokens, hardcoded JWT secrets.

## 2. Remediation Rules
1. Never commit plaintext secrets to Git repositories, even in private repos.
2. Store secrets strictly in environment variables or managed secrets stores (Vault, AWS Secrets Manager).
3. Ensure \`.gitignore\` explicitly excludes \`.env\`, \`.env.*.local\`, \`*.pem\`, \`*.key\`, \`*.pfx\`.
4. If a secret is committed: Immediately rotate/revoke it; do not assume deleting the commit in git is sufficient.`
  },
  {
    id: "dependency-vulnerability-audit",
    name: "dependency-vulnerability-audit",
    title: "Supply Chain & CVE Audit",
    command: "/dep-audit",
    category: "security",
    stars: "7k+ ⭐",
    repo: "https://github.com/trailofbits/skills",
    description: "Audits npm/pip/cargo dependencies for known CVEs, supply-chain risks, malicious typosquatting, and outdated packages.",
    content: `---
name: dependency-vulnerability-audit
description: Audit project dependencies and lockfiles for known CVEs, malicious packages, and supply chain security vulnerabilities.
---

# Dependency Security & Supply Chain Audit (Trail of Bits Standard)

Third-party dependencies represent the largest attack surface in modern applications:

## 1. Audit Strategy
- **Lockfile Verification**: Always commit and enforce lockfiles (\`package-lock.json\`, \`pnpm-lock.yaml\`, \`poetry.lock\`, \`Cargo.lock\`) to guarantee deterministic reproducible builds.
- **Automated Scanning**: Run \`npm audit\`, \`pip-audit\`, or \`cargo audit\` as a mandatory pre-flight gate.
- **Direct vs Transitive Dependencies**: Pin exact versions or tightly constrained ranges; periodically audit transitive dependency trees.
- **Typosquatting & Malicious Packages**: Verify package author and download volume before introducing new dependencies.

## 2. Remediation Guidelines
- For Critical or High CVEs: Update to patched versions immediately.
- If no patch exists: Assess whether the vulnerable function is actually reachable in your code path; wrap with safe validation or replace the package with native platform features (Ponytail principle).`
  }
];

export const CYBERSECURITY_RULES = `## Cybersecurity & Defensive Security Standards (OWASP & MITRE)
- **Input Validation & Sanitization**: Always validate and sanitize user input at the application boundary (Zod, Pydantic, schema validation). Never concatenate raw input into database queries or shell commands.
- **Secrets Management**: Never hardcode credentials, private tokens, or secrets. Always read from environment variables or secure stores.
- **Authorization & Access Control**: Enforce least privilege and verify permissions on every request (prevent IDOR / BOLA).
- **Safe Dependencies**: Audit third-party libraries for CVEs and lock versions.
- **Error Handling**: Never leak internal stack traces or database schema details in public API error responses.`;

export const HEADROOM_SKILL = {
  id: "headroom",
  name: "headroom",
  title: "Headroom Context & Token Compression",
  command: "/compress",
  category: "compression",
  stars: "71.8k+ ⭐",
  repo: "https://github.com/headroomlabs-ai/headroom",
  description: "Compresses tool outputs, logs, JSON, and files by 20-90% before they reach the LLM, preserving critical information and keeping context clean.",
  content: `---
name: headroom
description: Use to compress large tool outputs, command logs, bulky JSON data, and files, or inspect context compression statistics.
---

# Headroom: Context & Token Compression

Headroom reduces input token consumption by 20–90% across coding sessions, keeping your context window focused and preventing prompt-bloat:

## 1. Core Capabilities
- **SmartCrusher**: Compresses large JSON payloads and tabular dumps while preserving schema integrity and key values.
- **CodeCompressor**: Compresses repetitive source code, declarations, and AST structures without losing function signatures.
- **Kompress-v2-base**: Compresses verbose prose, system logs, and shell output while keeping critical lines (e.g. \`FATAL\`, \`ERROR\`, stack traces) byte-for-byte intact.
- **CCR (Context Compression Retrieval)**: Caches full uncompressed content locally; call \`headroom_retrieve\` whenever the full raw text is required.

## 2. Best Practices for Coding Agents
1. When running commands that produce massive stdout/stderr (e.g. test suites, build logs, git diffs > 500 lines), pass them through \`headroom_compress\` or examine compressed summaries.
2. Check token efficiency and savings with \`headroom_stats\`.
3. Never let runaway logs consume the context window — compress early.`
};

export const HEADROOM_RULES = `## Headroom Context & Token Compression Standards
- **Manage Context Window Budget**: Large tool outputs, test logs, and massive JSON responses should be compressed using Headroom or summarized to avoid blowing the context window.
- **Preserve Critical Diagnostics**: Always ensure error lines, stack traces, and fatal assertions are retained intact during compression.
- **Retrieve on Demand**: When precise byte-level details of a compressed block are required, use \`headroom_retrieve\`.`;

export const HEADROOM_TEMPLATES = {
  mcpConfigSnippet: {
    command: "uvx",
    args: ["headroom-ai[all]", "mcp"]
  }
};


