---
name: lighthouse-static-html
description: Lighthouse optimization workflow for static HTML/CSS/JS sites with deterministic fixes for LCP, CLS, script execution, render-blocking resources, and SEO safeguards.
---

# Lighthouse Static HTML Skill

## When to use

Use for static or mostly static websites where pages are delivered as HTML with optional vanilla JS.

Use when there is no framework hydration pipeline controlling rendering.

## Stack detection

Treat as static HTML when most of the following are true:

- No `package.json` build dependency on React/Next/Vue/Svelte
- Pages are `.html` templates or generated static files
- CSS and JS loaded via direct `<link>` and `<script>` tags

If framework signals are found, switch to the matching stack-specific skill.

## Guardrails

- Do not break semantic elements (`header`, `main`, `nav`, `article`, `footer`).
- Do not automatically remove analytics, security, consent, or compliance scripts.
- Do not introduce build tooling unless requested.
- Keep edits minimal and high-impact.

## Deterministic optimization sequence

### 1. LCP

- Identify the hero/LCP element on top landing pages.
- Preload hero image with `fetchpriority="high"` where supported.
- Ensure hero image is not lazy-loaded.
- Convert hero/media assets to WebP/AVIF where quality allows.

### 2. CLS

- Add explicit `width` and `height` on all content images.
- Apply `aspect-ratio` for responsive image containers.
- Reserve fixed/min height for async components like announcement bars.

### 3. JS execution / TBT / INP

- Add `defer` to non-critical scripts loaded in document head.
- Move optional scripts to end of body when possible.
- Split or remove legacy utility scripts not needed on first load.

### 4. Render-blocking resources

- Inline critical CSS for above-the-fold layout when CSS is small.
- Defer non-critical stylesheet loading (`media` strategy or late append).
- Remove duplicate CSS includes.

### 5. Fonts

- Self-host and serve `woff2`.
- Preload only one primary text font and one heading font if needed.
- Remove unused weight variants.

### 6. Caching / delivery

- Apply long cache headers for versioned static files.
- Use file fingerprinting (`app.<hash>.css/js`) where deploy pipeline supports it.
- Enable compression on static hosting platform.

### 7. SEO / accessibility follow-up

- Verify title/meta descriptions/canonical tags per page template.
- Ensure lazy-loading and script deferral did not hide meaningful content from assistive technologies.

## Stack-native optimizations

- Use `<link rel="preload" as="image" href="...">` for hero asset.
- Inline <= 10 KB truly critical CSS in page head.
- Defer analytics initialization only if policy-compliant.
- Add explicit dimensions to icons, logos, and article thumbnails.

## Anti-patterns

- Setting all images to eager loading.
- Inlining full CSS bundles into every page.
- Using AVIF only without fallback where browser support is uncertain.
- Deferring scripts that are required before DOM-ready user interactions.

## Expected output format

```md
## Static HTML Lighthouse Pass

### Detection
- Stack: static-html
- Evidence: <files/signals>

### Applied Fixes (Ordered)
1. LCP: ...
2. CLS: ...
3. JS/TBT/INP: ...
4. Render-blocking: ...
5. Fonts: ...
6. Caching/Delivery: ...
7. SEO/Accessibility: ...

### Metrics
- Before: LCP ..., CLS ..., TBT ..., INP ...
- After: LCP ..., CLS ..., TBT ..., INP ...

### Validation
- Semantics preserved: yes/no
- Critical scripts preserved: yes/no
- Dependencies added: none/list
```
