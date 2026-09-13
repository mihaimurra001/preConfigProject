---
name: api-contracts-and-backward-compat
description: Use when authoring or updating HTTP, REST, GraphQL, or RPC endpoints. Enforces strict contracts, idempotency, and non-breaking changes.
---

# API Contracts & Backward Compatibility

APIs are durable public contracts that outlive individual codebases:

## 1. Contract Validation (Schema First)
- All incoming payloads and query parameters must be strictly parsed and validated using schema libraries (Zod, Pydantic, JSON Schema).
- Strip unknown or unexpected parameters to prevent mass-assignment attacks.

## 2. Standard Error Responses (RFC 7807)
- Format all API error responses following RFC 7807 Problem Details:
  ```json
  {
    "type": "https://api.example.com/errors/insufficient-funds",
    "title": "Insufficient Funds",
    "status": 422,
    "detail": "Account balance $12.50 is below requested withdrawal $50.00",
    "instance": "/transactions/tx_12345"
  }
  ```

## 3. Idempotency for Mutating Actions
- Support `Idempotency-Key` headers for all non-safe state-mutating requests (POST payments, orders, transfers).
- Cache and replay previous responses for identical idempotency keys to prevent duplicate actions.

## 4. Non-Breaking Evolution Rules
- Never remove a field or change its type in an active API version.
- Adding optional fields is backwards-compatible; adding required fields is a breaking change.
- Mark deprecated fields with `@deprecated` and log deprecation telemetry before removal.