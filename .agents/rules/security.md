## Cybersecurity & Defensive Security Standards (OWASP & MITRE)
- **Input Validation & Sanitization**: Always validate and sanitize user input at the application boundary (Zod, Pydantic, schema validation). Never concatenate raw input into database queries or shell commands.
- **Secrets Management**: Never hardcode credentials, private tokens, or secrets. Always read from environment variables or secure stores.
- **Authorization & Access Control**: Enforce least privilege and verify permissions on every request (prevent IDOR / BOLA).
- **Safe Dependencies**: Audit third-party libraries for CVEs and lock versions.
- **Error Handling**: Never leak internal stack traces or database schema details in public API error responses.