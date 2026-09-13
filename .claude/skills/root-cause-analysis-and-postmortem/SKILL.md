---
name: root-cause-analysis-and-postmortem
description: Use when investigating non-trivial bugs, production regressions, or recurring failures. Enforces the 5 Whys and reproduction tests before fixing.
---

# Root Cause Analysis (5 Whys & Regression Reproduction)

Do not patch symptoms. Eliminate the defect permanently at its source:

## 1. The 5 Whys Ladder
- **Symptom**: What was observed? (e.g., Cannot read property 'id' of undefined)
- **Why 1**: Why was the variable undefined? (Service returned 204 instead of user object)
- **Why 2**: Why was 204 returned? (Query filter missed tenant boundary)
- **Why 3**: Why was the tenant boundary missing? (Middleware bypassed on internal RPC route)
- **Why 4**: Why was it bypassed? (Route registration order placed middleware after handler)
- **Why 5 (Root Cause)**: Why was route registration order unprotected? (No automated test verified middleware execution order)

## 2. Mandatory Regression Test Reproduction
- Before modifying a single line of production code, write an automated test that fails by reproducing the bug.
- If the test doesn't fail before your fix, you haven't reproduced the true root cause.

## 3. Call-Site Audit
- Grep all callers of the touched function or API.
- Fix the shared contract once; never duplicate defensive checks across ten different caller files.