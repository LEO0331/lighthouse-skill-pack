#!/usr/bin/env python3
"""Generate website/skills-data.js and website/skills-index.json from skills/*/SKILL.md."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SKILLS_DIR = ROOT / "skills"
OUTPUT_FILE = ROOT / "website" / "skills-data.js"
JSON_OUTPUT_FILE = ROOT / "website" / "skills-index.json"
SKILLS_MD_DIR = ROOT / "website" / "skills-md"


def parse_frontmatter(raw: str) -> tuple[str, str]:
    name = ""
    description = ""
    if not raw.startswith("---\n"):
        return name, description

    end = raw.find("\n---\n", 4)
    if end == -1:
        return name, description

    fm = raw[4:end].splitlines()
    for line in fm:
        if line.startswith("name:"):
            name = line.split(":", 1)[1].strip()
        elif line.startswith("description:"):
            description = line.split(":", 1)[1].strip()

    return name, description


def collect() -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for skill_dir in sorted(SKILLS_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue
        md = skill_dir / "SKILL.md"
        if not md.exists():
            continue
        content = md.read_text(encoding="utf-8")
        name, description = parse_frontmatter(content)
        if not name:
            name = skill_dir.name
        items.append(
            {
                "name": name,
                "description": description,
                "path": str(md.relative_to(ROOT)).replace("\\", "/"),
            }
        )
    return items


def main() -> None:
    raw_data = collect()
    SKILLS_MD_DIR.mkdir(parents=True, exist_ok=True)

    data: list[dict[str, str]] = []
    for item in raw_data:
        source_path = ROOT / item["path"]
        markdown = source_path.read_text(encoding="utf-8")
        out_name = item["name"] + ".md"
        out_rel = "skills-md/" + out_name
        out_path = SKILLS_MD_DIR / out_name
        out_path.write_text(markdown, encoding="utf-8")

        data.append(
            {
                "name": item["name"],
                "description": item["description"],
                "path": out_rel,
            }
        )

    payload = "window.SKILLS_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    OUTPUT_FILE.write_text(payload, encoding="utf-8")
    JSON_OUTPUT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_FILE} with {len(data)} skills")
    print(f"Wrote {JSON_OUTPUT_FILE} with {len(data)} skills")
    print(f"Wrote {SKILLS_MD_DIR} markdown files")


if __name__ == "__main__":
    main()
