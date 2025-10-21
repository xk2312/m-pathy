#!/bin/zsh
set -euo pipefail

# --- Tool-Check ---
need() { command -v "$1" >/dev/null 2>&1 || { echo "❌ missing: $1"; exit 
1; }; }
need git; need python3; need zip; need file; need shasum

# --- Pfade ---
REPO_ROOT="$PWD"
OUT_TMP="$(mktemp -d /tmp/repo_txt_XXXXXX)"
MIRROR="${OUT_TMP}/mirror"
META="${MIRROR}/__inventory__"
mkdir -p "$MIRROR" "$META"

echo "➡️  Repo: $REPO_ROOT"
echo "➡️  Temp: $OUT_TMP"

# --- Inventar ---
git ls-files > "${META}/tracked.txt" || true
git ls-files --others --exclude-standard > "${META}/untracked.txt" || true
cat "${META}/tracked.txt" "${META}/untracked.txt" | sort -u > 
"${META}/files_all.txt"
find . -path ./.git -prune -o -path ./node_modules -prune -o -path ./.next 
-prune -o -type f -print | sed 's|^\./||' | sort > "${META}/tree_all.txt"
du -hd 2 . 2>/dev/null | sort -h | tail -n 200 > "${META}/sizes.txt" || 
true
grep -R -nE 
"visualViewport|m-input-dock|StickyFab|MobileOverlay|OnboardingWatcher|Saeule|useMobileViewport|chat|scroll|overflow|safe-area|--dock-h" 
. --exclude-dir=".git" --exclude-dir="node_modules" --exclude-dir=".next" 
> "${META}/hotspots.txt" || true
{ echo "## git status (porcelain v1)"; git status --porcelain=v1; } > 
"${META}/git_status.txt" || true
git status --ignored -s > "${META}/git_ignored.txt" || true
git --no-pager log -n 20 --pretty=format:'%h %ad %d %s (%an)' --date=iso > 
"${META}/git_log.txt" || true
git diff --stat > "${META}/git_diffstat.txt" || true
git rev-parse --abbrev-ref HEAD > "${META}/branch.txt" || true
git rev-parse --short HEAD > "${META}/commit.txt" || true
if [ -f package.json ]; then
  /usr/bin/python3 - <<'PY' > "${META}/pkg_meta.json"
import json, sys
data = json.load(open("package.json"))
out = {
  "name": data.get("name"),
  "version": data.get("version"),
  "dependencies": data.get("dependencies", {}),
  "devDependencies": data.get("devDependencies", {})
}
print(json.dumps(out, indent=2, sort_keys=True))
PY
fi
[ -f next.config.js ] && sed -n '1,200p' next.config.js > 
"${META}/next_config_snip.js" || true

# --- Helper-Funktionen ---
is_text() {
  local f="$1"
  if [ ! -s "$f" ]; then return 0; fi
  grep -Iq . "$f"
}
normalize_to_txt() {
  local src="$1"
  local rel="${src#./}"
  local dst="${MIRROR}/${rel}.txt"
  mkdir -p "$(dirname "$dst")"
  sed $'s/\r$//' "$src" > "$dst" 2>/dev/null || cat "$src" > "$dst"
}
write_binary_stub() {
  local src="$1"
  local rel="${src#./}"
  local dst="${MIRROR}/${rel}.txt"
  mkdir -p "$(dirname "$dst")"
  local mime; mime="$(file -Ib "$src" 2>/dev/null || echo 
application/octet-stream)"
  local size; size="$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src" 
2>/dev/null || echo "?")"
  local sha; sha="$(shasum -a 256 "$src" 2>/dev/null | awk '{print $1}')"
  {
    echo "BINARY FILE PLACEHOLDER"
    echo "path: $rel"
    echo "size: ${size} bytes"
    echo "mime: $mime"
    echo "sha256: $sha"
    echo
    echo "Use the original binary from your repository if needed."
  } > "$dst"
}

# --- Spiegel: alle Dateien → .txt ---
echo "➡️  Spiegele Dateien …"
find . -path ./.git -prune -o -path ./node_modules -prune -o -path ./.next 
-prune -o -type f -print0 | while IFS= read -r -d '' f; do
  [ -f "$f" ] || continue
  if is_text "$f"; then
    normalize_to_txt "$f"
  else
    write_binary_stub "$f"
  fi
done

# --- ZIP bauen ---
DEST="$HOME/Desktop/staging-txt-bundle.zip"
( cd "$OUT_TMP" && zip -qr "$DEST" mirror )

echo "✅ Fertig: $DEST"
echo "   Inhalt: mirror/ (alle Dateien als .txt) + mirror/__inventory__ 
(Inventar)"

