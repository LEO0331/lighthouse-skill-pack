# lighthouse-skill-pack

Production-ready Lighthouse optimization skill pack for **Codex** and **Claude Code**.

`lighthouse-skill-pack` helps teams ship faster performance improvements with reusable, stack-specific `SKILL.md` workflows. It includes a static skill browser, cross-platform installers, E2E test coverage gates, and Lighthouse CI.

## Why this project exists

Most Lighthouse advice is either too generic to execute or too tied to one framework. This project provides deterministic, practical workflows that teams can copy directly into their AI coding setup and apply consistently across projects.

## Who this is for

- Engineering teams standardizing web performance workflows
- Agencies shipping Lighthouse improvements across multiple client stacks
- Individual developers who want repeatable, high-impact optimization playbooks

## Supported skills and stacks

- `lighthouse-core` (shared workflow and guardrails)
- `lighthouse-static-html`
- `lighthouse-react-vite`
- `lighthouse-nextjs`
- `lighthouse-wordpress`

## Repository layout

```text
.
├── skills/
│   ├── lighthouse-core/
│   ├── lighthouse-static-html/
│   ├── lighthouse-react-vite/
│   ├── lighthouse-nextjs/
│   └── lighthouse-wordpress/
├── installers/
├── examples/
└── website/
```

## Installation

### Claude Code (manual)

#### Personal skill (global)

1. Create the destination folder (if needed):
   - macOS/Linux: `~/.claude/skills/`
2. Copy one or more folders from `skills/` into `~/.claude/skills/`.
3. Restart Claude Code so skills are reloaded.

#### Project skill (repo-local)

1. Create (if missing): `<your-project>/.claude/skills/`
2. Copy desired skill folders into `<your-project>/.claude/skills/`
3. Commit project-local skills if your team wants shared behavior.

### Codex (local skills)

1. Create destination (if needed): `~/.codex/skills/`
2. Copy one or more folders from `skills/` into `~/.codex/skills/`
3. Restart Codex session or start a new one.

### Scripted install

Use scripts in [`installers/`](./installers):

- `installers/install-claude.sh`
- `installers/install-codex.sh`
- `installers/install.ps1`

Examples:

```bash
# Install all skills for Codex
bash installers/install-codex.sh

# Install only two skills for Claude Code
bash installers/install-claude.sh lighthouse-core lighthouse-nextjs
```

```powershell
# Windows / PowerShell
pwsh ./installers/install.ps1 -Target codex -Skills lighthouse-core,lighthouse-react-vite
```

## Website demo

Static site at [`website/`](./website) provides:

- skill browser cards
- markdown source viewer
- copy-to-clipboard
- download `.md`
- install instructions

Designed for GitHub Pages and local static serving.

### Run locally

Any static server works. Example with Python:

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

When skills change, regenerate website data:

```bash
python3 website/scripts/build-skills-data.py
```

Generated outputs:

- `website/skills-data.js` (browser data source)
- `website/skills-index.json` (optional downstream/package distribution format)

## E2E testing

Playwright E2E coverage is configured for the static website.

```bash
npm install
npx playwright install chromium
npm run test:e2e:coverage
```

The suite enforces a minimum `85%` JS coverage threshold for `website/app.js`.

## GitHub Actions

- `validate.yml`: script checks, generated-data sync, Playwright E2E + coverage gate.
- `lighthouse-ci.yml`: Lighthouse CI assertions for performance/accessibility/best-practices/SEO.
- `deploy-pages.yml`: deploys `website/` to GitHub Pages on `main`.

## Suggested GitHub About

- Description:
  `Reusable Lighthouse optimization skills for Codex and Claude Code, with a static skill browser, installers, E2E tests, and Lighthouse CI.`
- Topics/tags:
  `lighthouse`, `web-performance`, `core-web-vitals`, `seo`, `accessibility`, `codex`, `claude-code`, `skill-pack`, `github-pages`, `playwright`, `lhci`

## Usage examples

- Static HTML project: [`examples/static-html/`](./examples/static-html)
- React + Vite project: [`examples/react-vite/`](./examples/react-vite)
- Next.js project: [`examples/nextjs/`](./examples/nextjs)
- WordPress project: [`examples/wordpress/`](./examples/wordpress)

## Lighthouse CI sample (GitHub Actions)

See [`examples/lighthouse-ci.yml`](./examples/lighthouse-ci.yml).

## Screenshots

- Website overview: `docs/screenshots/website-overview.png`
- Skill detail: `docs/screenshots/skill-detail.png`

## Distribution note

Codex plugins can be added later as an optional distribution layer. This repository keeps raw skill folders as the primary source of truth.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT. See [`LICENSE`](./LICENSE).
