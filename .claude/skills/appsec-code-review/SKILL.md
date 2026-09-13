---
name: appsec-code-review
description: Audit source code for OWASP Top 10 security vulnerabilities, injection flaws, authentication weaknesses, and insecure data handling.
---

# Application Security (AppSec) Code Review & Vulnerability Audit

Perform rigorous security auditing against the OWASP Top 10 and CWE standards:

## 1. Vulnerability Checklist
- **Injection (CWE-89, CWE-78)**: Verify all database queries use parameterized prepared statements (never string interpolation). Verify all shell executions sanitize arguments or avoid shell invocation.
- **Cross-Site Scripting (XSS / CWE-79)**: Context-aware output encoding in templates/HTML responses. Safe innerText/textContent instead of innerHTML.
- **Server-Side Request Forgery (SSRF / CWE-918)**: Validate external URLs against allowlists, block private/internal IP ranges (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, AWS metadata 169.254.169.254).
- **Broken Object Level Authorization (BOLA / IDOR / CWE-639)**: Verify the authenticated user owns or is authorized to access the specific requested resource ID.
- **Authentication & Session (CWE-287, CWE-384)**: Strong password hashing (bcrypt, Argon2id), secure session cookies (`HttpOnly; Secure; SameSite=Strict`).
- **Path Traversal (CWE-22)**: Resolve user-supplied file paths with strict boundaries; reject `../` directory escapes.
- **Insecure Deserialization (CWE-502)**: Avoid native unpickling or untrusted object evaluation.

## 2. Review Process
1. Trace untrusted user input from entry points (HTTP handlers, CLI arguments, webhook payloads) to sinks (DB queries, shell commands, file I/O).
2. Report vulnerabilities with: File & Line, Severity (Critical/High/Medium/Low), CWE identifier, and concrete remediation code.
3. Verify that defenses cannot be bypassed with encoded payloads or alternate casing.