---
name: database-and-migrations-architect
description: Use when designing schemas, altering tables, writing migrations, or optimizing database queries. Enforces zero-downtime patterns and prevents table locks.
---

# Database & Zero-Downtime Migrations

Follow strict production database engineering practices:

## 1. Zero-Downtime Migrations (Expand-and-Contract)
- **Phase 1 (Expand)**: Add new columns as optional (nullable) or with non-locking defaults. Never drop or rename active columns in the same release.
- **Phase 2 (Dual Write / Dual Read)**: Application writes to both old and new columns, reads from new column with fallback.
- **Phase 3 (Backfill)**: Run asynchronous background migration jobs in small batches to populate existing rows without exhausting locks or replication lag.
- **Phase 4 (Contract)**: Remove old application references, then issue a separate migration to drop old columns.

## 2. Lock Safety & Indexing
- In PostgreSQL, always use `CREATE INDEX CONCURRENTLY` and `DROP INDEX CONCURRENTLY`.
- Never execute `ALTER TABLE ... ADD COLUMN ... DEFAULT (expensive_function())` on high-traffic tables.
- Add composite indexes based on query filter selectivity (most selective columns first).
- Use partial indexes for boolean flags or soft-deleted rows (`WHERE deleted_at IS NULL`).

## 3. Query Efficiency & N+1 Prevention
- Audit ORM queries (Prisma, Drizzle, TypeORM, SQLAlchemy) for sequential loops over foreign relations.
- Enforce batching with explicit joins, subqueries, or DataLoader patterns.
- Profile query plans using `EXPLAIN (ANALYZE, BUFFERS)` before committing complex queries.