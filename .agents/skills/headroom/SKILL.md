---
name: headroom
description: Use to compress large tool outputs, command logs, bulky JSON data, and files, or inspect context compression statistics.
---

# Headroom: Context & Token Compression

Headroom reduces input token consumption by 20–90% across coding sessions, keeping your context window focused and preventing prompt-bloat:

## 1. Core Capabilities
- **SmartCrusher**: Compresses large JSON payloads and tabular dumps while preserving schema integrity and key values.
- **CodeCompressor**: Compresses repetitive source code, declarations, and AST structures without losing function signatures.
- **Kompress-v2-base**: Compresses verbose prose, system logs, and shell output while keeping critical lines (e.g. `FATAL`, `ERROR`, stack traces) byte-for-byte intact.
- **CCR (Context Compression Retrieval)**: Caches full uncompressed content locally; call `headroom_retrieve` whenever the full raw text is required.

## 2. Best Practices for Coding Agents
1. When running commands that produce massive stdout/stderr (e.g. test suites, build logs, git diffs > 500 lines), pass them through `headroom_compress` or examine compressed summaries.
2. Check token efficiency and savings with `headroom_stats`.
3. Never let runaway logs consume the context window — compress early.