---
name: incremental-implementation
description: Use during active code construction. Implements features slice-by-slice, verifying each step.
---

# Incremental Implementation

Build features vertically and incrementally:

## Workflow
1. Select the next atomic task from the plan.
2. Implement only what is required for that slice.
3. Run existing and new tests to ensure zero regressions.
4. Commit or milestone the change before moving forward.