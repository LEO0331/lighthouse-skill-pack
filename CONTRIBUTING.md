# Contributing

Thanks for contributing to `lighthouse-skill-pack`.

## Goals for contributions

- Keep guidance deterministic and concise.
- Keep stack-specific details accurate and actionable.
- Prefer minimal high-impact fixes over broad rewrites.
- Preserve core guardrails around semantics, security scripts, and dependency control.

## Local workflow

1. Create a branch with prefix `codex/`.
2. Make focused changes.
3. Verify static website still loads and skill content renders.
4. Update `CHANGELOG.md`.
5. Open a PR with rationale and verification notes.

## Skill authoring rules

Each skill must:

- live in `skills/<skill-name>/SKILL.md`
- include YAML frontmatter with `name` and `description`
- include deterministic steps and expected output format
- follow priority order:
  1. LCP
  2. CLS
  3. JS execution / TBT / INP
  4. render-blocking resources
  5. fonts
  6. caching / delivery
  7. SEO / accessibility follow-up
- include guardrails:
  - do not break semantics
  - do not remove analytics/security/consent scripts automatically
  - do not introduce unnecessary dependencies
  - prefer minimal high-impact changes

## Website update rules

- Keep site static (no framework build step).
- Keep JavaScript modular and readable.
- Update `website/skills-data.js` when skill markdown changes.

## Pull request checklist

- [ ] Changes are minimal and reversible
- [ ] Skill docs remain concise and production-usable
- [ ] Website still lists and renders all skills
- [ ] Copy and download actions work
- [ ] Changelog entry added
