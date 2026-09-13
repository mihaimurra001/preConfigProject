---
name: graphify-workflow
description: Automated workflow to index and inspect codebase architecture.
---

# Graphify Workflow

1. Check if graph exists in `graphify-out/graph.json`.
2. If missing or out of date, run `graphify .`.
3. Consult `graphify-out/GRAPH_REPORT.md` for critical dependencies.