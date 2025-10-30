#!/usr/bin/env bash
# macOS — One-Command Deploy main -> prod
set -euo pipefail

# ==== CONFIG (lokal) ==========================================================
REPO_DIR="${REPO_DIR:-$HOME/Projekte/m-pathy-staging}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
SSH_HOST="${SSH_HOST:-deploy@188.245.206.61}"
SERVICE="${SERVICE:-mpathy}"

# ==== PRECHECKS (lokal) =======================================================
if [[ ! -d "$REPO_DIR/.git" ]]; then
  echo "❌ Repo nicht gefunden: $REPO_DIR"; exit 1
fi

git -C "$REPO_DIR" fetch --all --prune
CUR_BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)"
if [[ "$CUR_BRANCH" != "main" ]]; then
  echo "❌ Du bist auf '$CUR_BRANCH', erwartet: 'main'"; exit 2
fi

# Sauberer Baum?
if [[ -n "$(git -C "$REPO_DIR" status --porcelain)" ]]; then
  echo "❌ Working tree nicht clean. Bitte commit/stash."; exit 3
fi

git -C "$REPO_DIR" pull --ff-only

# Tarball-URL für origin/main
REPO_URL="$(git -C "$REPO_DIR" remote get-url origin)"
REPO_TGZ="${REPO_URL%.git}/archive/refs/heads/main.tar.gz"

# ==== REMOTE DEPLOY ===========================================================
# Wir übergeben REPO_TGZ als Env an die Remote-Shell, damit Quotes sicher bleiben.
ssh -o IdentitiesOnly=yes -i "$SSH_KEY" "$SSH_HOST" "REPO_TGZ='$REPO_TGZ' bash -s" <<'REMOTE'
set -euo pipefail

echo "==> START deploy (origin/main) $(date -Is)"

TS="$(date +%Y%m%d%H%M%S)"
REL="/srv/app/releases/$TS"
CUR="/srv/app/current"
LOG_DIR="/var/log/mpathy"
mkdir -p "$REL" "$LOG_DIR"

cd "$REL"
echo "==> Fetch tarball: \$REPO_TGZ"
curl -fsSL "$REPO_TGZ" | tar xz --strip-components=1

# Guard: Merge-Marker in der kritischen Datei
if egrep -n '^(<<<<<<<|=======|>>>>>>>)' app/page.tsx >/dev/null 2>&1; then
  echo "❌ Merge markers detected in app/page.tsx"; exit 10
fi

# Build
echo "==> npm ci"
npm ci --include=dev --no-audit --no-fund
echo "==> npm run build"
npm run build

# Atomare Übergabe
echo "==> rsync -> $CUR"
rsync -a --delete . "$CUR/"

# Service restart + Health
echo "==> systemctl restart mpathy"
sudo systemctl restart mpathy
sleep 1
systemctl is-active mpathy >/dev/null && echo "✅ mpathy ACTIVE" || { echo "❌ mpathy inactive"; exit 20; }

# einfache Smoke-Checks (lokal geroutet)
echo "==> Smoke-Check"
curl -fsS -H 'Host: m-pathy.ai' http://127.0.0.1/ >/dev/null && echo "✅ nginx->next OK"

# Logbuch
echo "Stable OK @ $(date -Is) -> $REL" | sudo tee -a "$LOG_DIR/stable.log" >/dev/null || true

echo "==> DONE $(date -Is)"
REMOTE

echo "🎉 Deploy abgeschlossen."
