---
name: secret-scanning
description: Scan codebase, git history, configuration files, and diffs to prevent accidental exposure of secrets and credentials.
---

# Secret Scanning & Credential Protection

Zero tolerance for hardcoded credentials in source control:

## 1. Detection Signatures
- **Cloud Credentials**: AWS Access Keys (`AKIA...`), Google Cloud service accounts, Azure client secrets.
- **API Tokens**: GitHub PATs (`ghp_...`), OpenAI/Anthropic/Stripe/Twilio API keys.
- **Cryptographic Keys**: RSA/OpenSSH private keys (`-----BEGIN PRIVATE KEY-----`), TLS certificates.
- **Connection Strings**: Database URIs containing embedded passwords (`postgres://user:pass@host/db`).
- **Sensitive Configs**: Uncommitted `.env` files, backup tokens, hardcoded JWT secrets.

## 2. Remediation Rules
1. Never commit plaintext secrets to Git repositories, even in private repos.
2. Store secrets strictly in environment variables or managed secrets stores (Vault, AWS Secrets Manager).
3. Ensure `.gitignore` explicitly excludes `.env`, `.env.*.local`, `*.pem`, `*.key`, `*.pfx`.
4. If a secret is committed: Immediately rotate/revoke it; do not assume deleting the commit in git is sufficient.