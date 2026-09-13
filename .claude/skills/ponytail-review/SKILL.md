---
name: ponytail-review
description: Review changes like a lazy senior dev. Flags over-engineering, unneeded abstractions, new dependencies, and boilerplate.
---

# Ponytail Code Review

Review the current diff or implementation:
1. Did we add code that isn't strictly necessary?
2. Are there wrappers, interfaces, or factories where a direct call was enough?
3. Did we install an npm/pip package for something 3 lines of stdlib could do?
4. Suggest deletions and one-line replacements.