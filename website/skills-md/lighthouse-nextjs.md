---
name: lighthouse-nextjs
description: Lighthouse optimization workflow for Next.js using next/image, next/font, script strategy tuning, client bundle reduction, and server/component boundary discipline.
---

# Lighthouse Next.js Skill

## When to use

Use for Next.js applications (App Router or Pages Router) where Lighthouse performance is affected by client bundle size, image/font loading, and script strategy.

## Stack detection

Confirm Next.js when one or more are present:

- `next.config.*`
- `package.json` includes `next`
- `app/` or `pages/` directory with Next routing conventions

## Guardrails

- Preserve semantic landmarks and accessible heading order.
- Do not auto-remove analytics, consent, or security-related scripts.
- Avoid adding dependencies when Next built-ins solve the issue.
- Prefer moving logic server-side before adding optimization libraries.

## Deterministic optimization sequence

### 1. LCP

- Identify LCP element per critical route.
- Use `next/image` for hero imagery with correct size hints.
- Set `priority` only for true hero image.
- Ensure remote image config and formats are optimized.

### 2. CLS

- Use explicit dimensions/fill strategy correctly with `next/image` containers.
- Reserve layout space for dynamic slots and ads.
- Use `next/font` to reduce layout shifts from late font swaps.

### 3. JS execution / TBT / INP

- Reduce client bundle spread: move logic from client components to server components where possible.
- Minimize `use client` surface area.
- Dynamically import heavy client-only widgets.
- Audit third-party scripts and defer non-critical execution.

### 4. Render-blocking resources

- Use `next/script` loading strategy (`afterInteractive` or `lazyOnload`) for non-critical scripts.
- Remove global CSS/imports not required for initial route.
- Preload only proven critical assets.

### 5. Fonts

- Use `next/font` for local/google font optimization.
- Limit families and weight variants.
- Verify fallback stacks to avoid visual instability.

### 6. Caching / delivery

- Ensure static assets are cacheable with immutable hashes.
- Validate ISR/SSG strategy for cache hit rates on key routes.
- Use CDN/edge delivery where available.

### 7. SEO / accessibility follow-up

- Validate metadata APIs produce stable title/description/canonical tags.
- Confirm route refactors preserve crawlable content and accessible DOM order.

## Stack-native optimizations

- Prefer server components for data-heavy rendering.
- Use `next/image` and `next/font` before custom libraries.
- Keep script strategies explicit and route-aware.
- Reduce cross-route shared client code where possible.

## Anti-patterns

- Marking broad component trees with `use client` by default.
- Setting `priority` on many images.
- Injecting third-party scripts in blocking order without necessity.
- Pushing all pages into dynamic rendering when SSG/ISR is sufficient.

## Expected output format

```md
## Next.js Lighthouse Pass

### Detection
- Stack: nextjs
- Evidence: <next files>

### Applied Fixes (Ordered)
1. LCP: ...
2. CLS: ...
3. JS/TBT/INP: ...
4. Render-blocking: ...
5. Fonts: ...
6. Caching/Delivery: ...
7. SEO/Accessibility: ...

### Next.js Notes
- Client components reduced: yes/no
- Script strategy updates: <list>
- Image/font migration: <list>

### Validation
- Semantics preserved: yes/no
- Critical scripts preserved: yes/no
- Dependencies added: none/list
```
