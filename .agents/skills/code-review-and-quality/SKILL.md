---
name: code-review-and-quality
description: Use before merging, committing, or closing a task. Performs an objective 5-axis review of changes.
---

# 5-Axis Code Review

Evaluate all changed code across 5 distinct axes:
1. **Correctness**: Does the code fulfill the spec without bugs or edge-case oversights?
2. **Architecture**: Does it adhere to project patterns, avoiding tight coupling or leaky abstractions?
3. **Security**: Sanitization, authorization checks, secret leakage, safe dependencies.
4. **Performance**: Algorithmic complexity, unnecessary allocations, blocking I/O.
5. **Readability & Maintainability**: Clear naming, self-documenting code, no dead code.