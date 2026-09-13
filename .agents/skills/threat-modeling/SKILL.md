---
name: threat-modeling
description: Analyze software architecture, APIs, and data flows using the STRIDE framework to identify security threats before implementation.
---

# STRIDE Threat Modeling

Before building new services, endpoints, or data models, conduct a structured threat model:

## 1. Deconstruction
- **Assets**: What valuable data or compute power must be protected?
- **Data Flow Diagram (DFD)**: Map processes, data stores, data flows, and external entities.
- **Trust Boundaries**: Identify where data crosses from untrusted to trusted environments (e.g. Browser -> API Gateway -> Database).

## 2. STRIDE Threat Analysis
- **Spoofing**: Can an attacker pretend to be another user, service, or machine? (*Mitigation: Mutual TLS, cryptographic tokens, signed JWTs*).
- **Tampering**: Can data in transit or at rest be modified without detection? (*Mitigation: TLS, HMAC signatures, checksums, immutable logs*).
- **Repudiation**: Can an attacker deny performing an action? (*Mitigation: Secure audit logging with timestamps and tamper-proof storage*).
- **Information Disclosure**: Can sensitive data be read by unauthorized parties? (*Mitigation: Encryption at rest and in transit, redaction of PII*).
- **Denial of Service**: Can resources be exhausted to disrupt availability? (*Mitigation: Rate limiting, timeouts, request payload size limits, pagination*).
- **Elevation of Privilege**: Can an unprivileged user execute admin operations? (*Mitigation: Role-Based Access Control (RBAC), principle of least privilege*).