---
version: 1.0
name: AI-Agent-Configurator-Architectural-System
description: Modern architectural light design system: pure white and deep charcoal with 2px sharp tactile edges, 40px grid matrix, Plus Jakarta Sans, and emerald status telemetry.
---

# Design System: AI Agent Configurator (Architectural Light)

## 1. Palette & Surface Depth
- **Canvas / Background**: `#fbfbfd` (Airy architectural white with 40px hairline grid)
- **Primary Card Surface**: `#ffffff` (Sharp glass card with 1px border)
- **Subtle Surface**: `#f4f4f6`
- **Surface Hover**: `#eaecee`
- **Border Default**: `#dcdfe4` (Crisp hairline border)
- **Border Hover**: `#9ca3af`
- **Accent Primary**: `#18181b` / `#09090b` (Obsidian Charcoal)
- **Accent Gradient**: `linear-gradient(135deg, #18181b 0%, #09090b 100%)`
- **Telemetry Emerald**: `#10b981` (Active status dots & success badges)
- **Text Primary**: `#09090b` (Deep Jet Black)
- **Text Secondary**: `#4b5563` (Refined Slate Gray)

## 2. Typography Hierarchy
- **Sans-Serif**: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace
- Heading Scale:
  - Page Title: 14px font-bold tracking-tight uppercase
  - Section Header: 12px font-bold tracking-wider uppercase
  - Body Text: 12px font-normal leading-relaxed
  - Code / Telemetry: 11px font-mono font-semibold

## 3. Geometry & Border Radius
- **Sharp Radius**: `2px` (rounded-sm) — no overly rounded bubbles or blobby corners
- **Square Radius**: `0px` for tabs, badges, and technical chips
- **Border**: Strictly `1px solid` hairline strokes; zero heavy dark borders

## 4. Interaction & Motion (Emil Kowalski Physics)
- Enter transitions: `cubic-bezier(0.16, 1, 0.3, 1)` (fast spring deceleration)
- Duration: 150ms micro-interactions, max 220ms for cards
- Never use `ease-in` on entering elements; always decelerate
- Anti-Slop Discipline: Zero generic purple gradients, zero cards-inside-cards, strict visual density.