---
name: lighthouse-wordpress
description: Lighthouse optimization workflow for WordPress with deterministic handling of plugin/theme bloat, render-blocking assets, caching/CDN strategy, and image optimization.
---

# Lighthouse WordPress Skill

## When to use

Use for WordPress sites where theme/plugin asset bloat and cache configuration are primary Lighthouse constraints.

## Stack detection

Confirm WordPress when one or more are present:

- `wp-content/`, `wp-includes/`, `wp-admin/`
- `functions.php` and theme templates
- common plugin/theme asset enqueue patterns

## Guardrails

- Do not break semantic template structure or accessibility roles.
- Do not remove analytics/security/consent plugins/scripts automatically.
- Avoid installing additional optimization plugins when native/theme-level edits suffice.
- Prefer minimal high-impact changes in theme and enqueue layers.

## Deterministic optimization sequence

### 1. LCP

- Identify homepage and top landing page LCP elements.
- Optimize hero images (size/compression/format).
- Preload hero image when stable across templates.
- Remove slider/video hero anti-patterns when feasible.

### 2. CLS

- Enforce width/height for featured images and content media.
- Reserve space for dynamic blocks, banners, and ads.
- Stabilize web font behavior to reduce reflow.

### 3. JS execution / TBT / INP

- Audit plugin JS footprint and remove unused front-end scripts.
- Load plugin scripts only on required templates.
- Delay non-essential third-party scripts.
- Reduce theme-level JS on initial render path.

### 4. Render-blocking resources

- Minimize and defer non-critical theme/plugin CSS/JS.
- Reduce enqueue duplication across parent/child themes.
- Inline small critical CSS only for core templates.

### 5. Fonts

- Self-host/subset fonts where possible.
- Keep font family/weight matrix lean.

### 6. Caching / delivery

- Enable page caching + object cache where supported.
- Configure CDN and cache headers for static assets.
- Validate image optimization pipeline (original upload, generated sizes, modern formats).

### 7. SEO / accessibility follow-up

- Verify SEO plugin outputs (title/meta/canonical/open graph).
- Confirm performance edits did not alter heading order, landmarks, or alt text behavior.

## Stack-native optimizations

- Refactor `wp_enqueue_*` conditions to load assets per template.
- Trim plugin/theme bloat before introducing new optimization plugins.
- Use media pipeline rules for WebP/AVIF derivatives where hosting supports it.
- Ensure cache invalidation strategy aligns with content updates.

## Anti-patterns

- Installing multiple overlapping optimization plugins.
- Defer-all approach that breaks theme or plugin dependencies.
- Unbounded critical CSS generation across every page.
- Ignoring cache purge rules after deploy/content updates.

## Expected output format

```md
## WordPress Lighthouse Pass

### Detection
- Stack: wordpress
- Evidence: wp structure + theme/plugin files

### Applied Fixes (Ordered)
1. LCP: ...
2. CLS: ...
3. JS/TBT/INP: ...
4. Render-blocking: ...
5. Fonts: ...
6. Caching/Delivery: ...
7. SEO/Accessibility: ...

### WordPress Notes
- Plugin payload reductions: ...
- Enqueue condition changes: ...
- Cache/CDN settings touched: ...

### Validation
- Semantics preserved: yes/no
- Critical scripts/plugins preserved: yes/no
- Dependencies/plugins added: none/list
```
