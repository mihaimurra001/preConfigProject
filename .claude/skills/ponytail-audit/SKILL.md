---
name: ponytail-audit
description: Audits project dependencies and code bloat, recommending native replacements and removals.
---

# Ponytail Dependency Audit

Inspect `package.json`, `requirements.txt`, or `go.mod`:
1. Identify utility packages that modern runtimes already provide (e.g., lodash functions, left-pad, is-promise, date formatters).
2. Recommend concrete steps to uninstall them and replace with native code.