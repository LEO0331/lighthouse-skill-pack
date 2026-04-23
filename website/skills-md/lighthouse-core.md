---
name: lighthouse-core
description: Deterministic Lighthouse optimization workflow focused on LCP, CLS, JS execution, render blocking, fonts, caching, SEO, and accessibility follow-up.
---

# Lighthouse Core Skill

## When to use

Use this skill as the default optimization workflow for any web app before stack-specific tuning.

Use when you need repeatable, minimal, high-impact changes that improve Lighthouse Performance and protect SEO/accessibility quality.

## Inputs

- Lighthouse report JSON or web.dev report output
- URL environment target (local/staging/prod)
- Current stack (if known)

## Guardrails

- Do not break semantic HTML structure to increase scores.
- Do not remove analytics, security headers/scripts, or consent scripts automatically.
- Do not add dependencies unless there is no simpler alternative.
- Prefer minimal changes that improve multiple metrics.

## Stack detection handoff

1. Detect stack from files and runtime:
   - `next.config.*` or `app/` + `pages/` -> Next.js
   - `vite.config.*` + React deps -> React + Vite
   - WordPress theme/plugin structure (`wp-content`) -> WordPress
   - otherwise static/server-rendered HTML workflow
2. After core pass, run the stack-specific skill.

## Deterministic execution order

### 1. LCP first

- Identify LCP element type (image/text/block).
- If image LCP:
  - prioritize compression and right sizing
  - add preload for exact hero asset URL
  - avoid lazy-loading LCP asset
- If text/block LCP:
  - reduce CSS and JS required before first paint
  - remove late font swaps for heading text
- Re-run Lighthouse and capture LCP delta.

### 2. CLS

- Add explicit width/height or aspect-ratio for media and embeds.
- Reserve space for dynamic UI (banners, consent bars, ad slots).
- Avoid layout shifts from late font changes.
- Re-run Lighthouse and capture CLS delta.

### 3. JS execution / TBT / INP

- Remove unused scripts and dead polyfills.
- Split large bundles and defer non-critical execution.
- Delay non-essential third-party scripts until interaction or idle.
- Reduce main-thread long tasks.
- Re-run Lighthouse and capture TBT + INP delta.

### 4. Render-blocking resources

- Inline small critical CSS where safe.
- Defer non-critical CSS and JS.
- Preload only proven critical assets.
- Eliminate duplicate style/script inclusion.

### 5. Fonts

- Serve modern formats (`woff2`).
- Preload critical font files used above the fold.
- Use `font-display: swap` unless visual stability requires a stricter strategy.
- Remove unused font weights/styles.

### 6. Caching / delivery

- Add long cache headers for versioned assets.
- Enable compression (Brotli/Gzip) and CDN where available.
- Ensure static assets are immutable with content hashes.

### 7. SEO / accessibility follow-up

- Validate title/meta/canonical consistency.
- Confirm heading structure and landmark semantics remain intact.
- Ensure images keep meaningful `alt` text where required.
- Confirm performance edits did not regress keyboard navigation.

## Anti-patterns

- Chasing score-only changes that worsen UX semantics.
- Blanket inlining of large CSS files.
- Preloading too many assets (preload spam).
- Converting all scripts to async/defer without dependency checks.
- Deleting tracking/security/consent integrations without policy approval.

## Expected output format

Return a concise report in this structure:

```md
## Lighthouse Optimization Report

### Baseline
- URL: <target>
- Scores: Performance <x>, Accessibility <x>, Best Practices <x>, SEO <x>
- Core metrics: LCP <x>, CLS <x>, TBT <x>, INP <x>

### Changes Applied (Ordered)
1. LCP: <change + reason>
2. CLS: <change + reason>
3. JS/TBT/INP: <change + reason>
4. Render-blocking: <change + reason>
5. Fonts: <change + reason>
6. Caching/Delivery: <change + reason>
7. SEO/Accessibility: <validation + fixes>

### Results
- New scores: ...
- Metric deltas: LCP ..., CLS ..., TBT ..., INP ...

### Risk Check
- Semantics preserved: yes/no
- Analytics/security/consent scripts preserved: yes/no
- New dependencies added: none/list

### Next 3 Improvements
1. ...
2. ...
3. ...
```
