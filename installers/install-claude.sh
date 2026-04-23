#!/usr/bin/env bash
set -euo pipefail

# Installs selected lighthouse skills into ~/.claude/skills.
# Usage:
#   bash installers/install-claude.sh
#   bash installers/install-claude.sh lighthouse-core lighthouse-nextjs

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$REPO_ROOT/skills"
TARGET_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

mkdir -p "$TARGET_DIR"

if [ "$#" -eq 0 ]; then
  mapfile -t SKILLS < <(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort)
else
  SKILLS=("$@")
fi

is_safe_skill_name() {
  local name="$1"
  [[ "$name" =~ ^[A-Za-z0-9._-]+$ ]]
}

for skill in "${SKILLS[@]}"; do
  if ! is_safe_skill_name "$skill"; then
    echo "[skip] Invalid skill name: $skill"
    continue
  fi

  src="$SOURCE_DIR/$skill"
  dst="$TARGET_DIR/$skill"

  if [ ! -d "$src" ]; then
    echo "[skip] Skill not found: $skill"
    continue
  fi

  case "$dst" in
    "$TARGET_DIR"/*) ;;
    *)
      echo "[skip] Unsafe target path resolved for: $skill"
      continue
      ;;
  esac

  rm -rf "$dst"
  cp -R "$src" "$dst"
  echo "[ok] Installed $skill -> $dst"
done

echo "Done. Restart Claude Code to load updated skills."
