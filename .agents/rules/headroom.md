## Headroom Context & Token Compression Standards
- **Manage Context Window Budget**: Large tool outputs, test logs, and massive JSON responses should be compressed using Headroom or summarized to avoid blowing the context window.
- **Preserve Critical Diagnostics**: Always ensure error lines, stack traces, and fatal assertions are retained intact during compression.
- **Retrieve on Demand**: When precise byte-level details of a compressed block are required, use `headroom_retrieve`.