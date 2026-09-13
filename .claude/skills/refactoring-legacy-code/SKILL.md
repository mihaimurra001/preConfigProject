---
name: refactoring-legacy-code
description: Use when refactoring complex, untyped, tightly-coupled legacy code or migrating monolithic modules safely without breaking existing behavior.
---

# Legacy Code Refactoring (Strangler Fig)

Never perform a ground-up rewrite. Safely decouple and modernize legacy systems step by step:

## 1. Characterization Testing (Golden Master)
- Before changing ANY logic, wrap the legacy module in automated snapshot tests using real production-like inputs.
- Record existing outputs (including known quirks/bugs) as the baseline standard of truth.

## 2. Identify the Seam & Define Clean Interface
- Identify the clean boundary where legacy code receives input and returns output.
- Define a type-safe interface or TypeScript contract representing the modern desired API.

## 3. Strangler Fig Migration Pattern
- Write the new implementation alongside the legacy implementation.
- Route a small slice of traffic or callers through the new implementation.
- Compare outputs in shadow mode or feature flags if the domain logic is critical (billing, auth).

## 4. Prune Dead Legacy Branches
- Once 100% of callers utilize the new implementation, safely delete the legacy file.
- Verify that all characterization tests and unit tests remain green.