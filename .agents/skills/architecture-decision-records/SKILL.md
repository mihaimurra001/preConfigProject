---
name: architecture-decision-records
description: Use when making significant architectural choices (libraries, database engines, design patterns, protocols). Documents rationale in docs/adr/.
---

# Architecture Decision Records (ADR)

Capture architectural decisions in durable markdown documents that outlive chats:

## Location & Format
Store records in `docs/adr/NNNN-title-in-kebab-case.md` (e.g. `docs/adr/0001-use-drizzle-orm.md`).

## Standard Structure (MADR)
```markdown
# ADR 0001: [Short Title of Decision]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## Context & Problem Statement
What technical challenge or architectural trade-off are we addressing? What constraints exist?

## Decision Drivers
- Need for type-safe schema definitions
- Zero runtime overhead and small bundle footprint
- Simple migration pipeline compatible with PostgreSQL

## Considered Options
1. Option A: Drizzle ORM
2. Option B: Prisma
3. Option C: Raw pg SQL

## Decision Outcome
Chosen option: **Option A (Drizzle ORM)** because it provides zero-overhead SQL-like TypeScript query building without heavy rust engine binaries.

### Positive Consequences
- Instant build times and minimal package footprint
- Native support for relational queries and prepared statements

### Negative Consequences / Trade-offs
- Manual migration file management required compared to Prisma's automatic shadow DB
```