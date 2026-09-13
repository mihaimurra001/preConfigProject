---
name: concurrency-and-race-conditions
description: Use when writing shared state mutations, async job queues, inventory decrementing, or balance transfers. Prevents race conditions and double-spends.
---

# Concurrency, Race Conditions & State Integrity

Concurrent execution turns rare edge cases into frequent production corruptions:

## 1. Eliminate Read-Modify-Write Hazards
- **Dangerous**:
  ```typescript
  const user = await db.getUser(id);
  user.balance -= amount;
  await db.saveUser(user);
  ```
- **Safe (Atomic SQL Statement)**:
  ```sql
  UPDATE accounts 
  SET balance = balance - :amount, updated_at = NOW() 
  WHERE id = :id AND balance >= :amount;
  ```

## 2. Time-of-Check to Time-of-Use (TOCTOU)
- Never check permissions or file existence in one step and then act on it in a separate unsynchronized step.
- Use atomic filesystem primitives (`open(..., O_CREAT | O_EXCL)`) or database constraints (unique keys, row-level locks via `SELECT ... FOR UPDATE`).

## 3. Distributed Locking Guardrails
- Always attach finite TTLs to distributed locks (Redis Redlock, Postgres advisory locks) to avoid permanent deadlocks if a worker crashes.
- Verify lock ownership token before releasing to prevent releasing another worker's acquired lock after a TTL timeout.