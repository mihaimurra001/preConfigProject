---
name: graphify
description: Turn any codebase, with docs, SQL schemas, and configs, into a queryable knowledge graph. Query architecture and cross-file connections with minimal token consumption.
---

# Graphify Knowledge Graph Skill

Use this skill to inspect cross-file dependencies, architectural flows, and high-level structure without brute-force grep or reading dozens of files.

## Commands
- `/graphify .` : Build or rebuild the knowledge graph for current directory.
- `/graphify query "<question>"` : Query the knowledge graph.
- `/graphify path "<source>" "<target>"` : Find shortest connection path between two symbols.
- `/graphify explain "<symbol>"` : Explain relationships for a class, function, or component.

## Best Practices
- Before answering broad codebase architecture questions, query the graph first to identify relevant files, saving 70x tokens.
- Review `graphify-out/GRAPH_REPORT.md` for central hub nodes and structural insights.