---
name: animate
description: Build fluid, performant animations from scratch choosing the correct curve, duration, properties, and hardware acceleration.
---

# Fluid Animation Skill

- **Animate only `transform` and `opacity`**: Avoid animating `height`, `width`, `top`, or `margin` which trigger browser layout reflow.
- **Respect `prefers-reduced-motion`**: Always wrap motion with accessible media queries.
- **Exit fast, enter smooth**: Exit animations should be 20-30% faster than entry animations.