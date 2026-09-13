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
- Border Radius: 6px standard, 9999px for pills`
};

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


