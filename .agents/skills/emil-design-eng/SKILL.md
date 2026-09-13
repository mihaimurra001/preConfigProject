---
name: emil-design-eng
description: Professional interaction design, fluid animations, and micro-interactions by Emil Kowalski (Linear & Vercel).
---

# Emil Kowalski: Design Engineering & Motion

## Golden Rules for UI Motion
1. **Never use `ease-in` for entering elements.** Elements entering the viewport must use `ease-out` (decelerating) so they start fast and settle gently.
2. **Spring Physics over Linear Durations**: Interactive elements (buttons, modals, sheets) feel tactile when driven by spring curves (`stiffness: 300, damping: 30`).
3. **Subtle Shadows over Harsh Borders**: Use multi-layer, semi-transparent box-shadows (`rgba(0,0,0,0.06)` to `rgba(0,0,0,0.12)`) instead of thick solid borders.
4. **Duration Budget**: Micro-interactions must complete in 150ms–250ms. Never make users wait for decorative animations.