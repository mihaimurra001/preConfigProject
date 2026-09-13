---
name: accessibility-and-inclusive-design
description: Use when designing or reviewing user interfaces, dialogs, forms, navigation menus, and custom interactive widgets.
---

# Accessibility (WCAG 2.2 AA & ARIA)

Software must be accessible to everyone, including keyboard-only and screen reader users:

## 1. Semantic HTML Over ARIA Hacks
- Use native `<button>` instead of `<div onclick="...">` with `role="button"`.
- Use native `<dialog>`, `<nav>`, `<main>`, `<header>`, and `<ul>` elements.
- Never strip focus outlines (`outline: none`) without providing a distinct replacement `:focus-visible` style.

## 2. Complete Keyboard Navigation
- Every interactive element must be reachable and operable using `Tab`, `Enter`, and `Space`.
- Escape key must close dropdowns, tooltips, and modal dialogs.
- Active modals must trap keyboard focus so `Tab` does not escape to background content.

## 3. Contrast & Screen Reader Clarity
- Maintain at least 4.5:1 text-to-background contrast ratio (3:1 for large text).
- Add `aria-label` or `title` to icon-only buttons (`<button aria-label="Închide dialogul"><svg .../></button>`).
- Ensure form inputs have associated `<label for="...">` tags.