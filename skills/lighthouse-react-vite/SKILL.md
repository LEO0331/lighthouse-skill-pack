---
name: lighthouse-react-vite
description: Lighthouse workflow for React + Vite apps with focus on route-level lazy loading, dynamic imports, bundle reduction, hydration cost control, and stable UX semantics.
---

# Lighthouse React + Vite Skill

## When to use

Use for React applications built with Vite where JavaScript execution and bundle size dominate Lighthouse bottlenecks.

## Stack detection

Confirm React + Vite when:

- `vite.config.*` exists
- `package.json` includes `vite` and `react`
- entry path resembles `src/main.(jsx|tsx)`

If Next.js or WordPress indicators are present, switch skills.

## Guardrails

- Preserve semantic structure in JSX output.
- Do not remove analytics/security/consent scripts automatically.
- Avoid adding state-management or performance dependencies unless required.
- Prefer code splitting and deletion over new abstractions.

## Deterministic optimization sequence

### 1. LCP

- Identify route-specific LCP element.
- Ensure hero media is optimized and eagerly available.
- Preload critical hero asset when route shell allows it.
- Move heavy non-critical components below the fold.

### 2. CLS

- Add stable placeholders/skeletons with fixed dimensions.
- Ensure async component mounts reserve space.
- Stabilize font and icon loading to avoid reflow.

### 3. JS execution / TBT / INP

- Apply route-level lazy loading (`React.lazy`, dynamic import).
- Split heavy feature modules (charts/editors/maps) behind interaction.
- Remove dead dependencies and large utility imports.
- Profile hydration and reduce top-of-page client component complexity.

### 4. Render-blocking resources

- Remove CSS imports not needed for above-the-fold route.
- Defer third-party SDK initialization.
- Preload only verified critical chunks.

### 5. Fonts

- Subset/self-host fonts when possible.
- Keep font families and weight variants minimal.

### 6. Caching / delivery

- Ensure Vite output hashes are enabled for immutable caching.
- Serve assets from CDN when available.
- Verify Brotli/Gzip and cache-control headers.

### 7. SEO / accessibility follow-up

- Ensure lazy loading does not hide meaningful page content from crawlers.
- Validate heading hierarchy and landmark regions after component refactors.

## Stack-native optimizations

- Route-level code splitting in router config.
- Dynamic import for heavy libraries only on demand.
- Bundle trimming: replace broad imports with direct module imports.
- Hydration cost awareness: minimize client work in first viewport components.

## Anti-patterns

- Global lazy loading that delays above-the-fold content.
- Massive shared vendor chunk due to poor import boundaries.
- Overusing memoization as a substitute for reducing render work.
- Importing entire utility libraries for one function.

## Expected output format

```md
## React + Vite Lighthouse Pass

### Detection
- Stack: react-vite
- Evidence: vite config + package deps

### Applied Fixes (Ordered)
1. LCP: ...
2. CLS: ...
3. JS/TBT/INP: ...
4. Render-blocking: ...
5. Fonts: ...
6. Caching/Delivery: ...
7. SEO/Accessibility: ...

### Bundle Notes
- Main entry before/after: ...
- Largest chunks before/after: ...

### Validation
- Semantics preserved: yes/no
- Critical scripts preserved: yes/no
- Dependencies added: none/list
```
