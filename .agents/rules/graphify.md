# Graphify Architectural Guidance

- Before performing deep exploration across multiple unfamiliar files, check if `graphify-out/graph.json` exists.
- If the knowledge graph is available, query it or use the graphify MCP server tools to identify caller hierarchies and dependency pathways.
- Re-run `/graphify .` whenever major structural changes or schema migrations take place.