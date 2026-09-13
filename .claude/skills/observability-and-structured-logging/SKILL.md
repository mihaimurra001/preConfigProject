---
name: observability-and-structured-logging
description: Use when adding logging, monitoring, metrics, health checks, or tracing. Enforces structured JSON and distributed context propagation.
---

# Observability, Structured Logging & Health

Production systems must be observable without attaching a remote debugger:

## 1. Structured JSON Logging
- Never output unstructured string text (`console.log("user logged in: " + user)`).
- Log JSON payloads with standard keys:
  ```json
  {
    "timestamp": "2026-09-13T21:40:00.000Z",
    "level": "info",
    "message": "User session authenticated",
    "service": "auth-service",
    "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
    "span_id": "00f067aa0ba902b7",
    "user_id": "usr_98124",
    "duration_ms": 14.2
  }
  ```

## 2. Request Correlation & Context Propagation
- Extract or generate an `x-request-id` header at the API boundary.
- Propagate the request ID through async context and include it in all outbound HTTP/RPC client calls.

## 3. Production Health Probes
- Implement standardized health endpoints:
  - `/healthz` (Liveness): Returns 200 if the process event loop is responsive.
  - `/readyz` (Readiness): Returns 200 only if critical dependencies (database, message queue) are connected and ready to accept traffic.