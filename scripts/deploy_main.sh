#!/usr/bin/env bash
# macOS — One-Command: promote staging→main, then deploy main→prod
set -euo pipefail

# ====== CONFIG (local) ========================================================
REPO_DIR="${REPO_DIR:-$HOME/Projekte/m-pathy-staging}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
SSH_HOST="${SSH_HOST:-deploy@188.245.206.61}"
SERVICE="${SERVICE:-mpathy}"
REMOTE_NAME="${REMOTE_NAME:-origin}"         # Git remote name
PROMOTE_MODE="${PROMOTE_MODE:-auto}"         # auto|skip  (set skip to deploy current main without promotion)

# ====== PRECHECKS (local) =====================================================
if [[ ! -d "$REPO_DIR/.git" ]]; then
  echo "❌ Repo nicht gefunden: $REPO_DIR"; exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  [[ "$PROMOTE_MODE" == "auto" ]] && {
    echo "❌ GitHub CLI 'gh' fehlt. Installiere es (brew install gh) und 'gh auth login'."; exit 1; }
fi

git -C "$REPO_DIR" fetch --all --prune

CUR_BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)"
if [[ "$CUR_BRANCH" != "main" ]]; then
  echo "❌ Du bist auf '$CUR_BRANCH', erwartet: 'main'"; exit 2
fi

# Working tree must be clean
if [[ -n "$(git -C "$REPO_DIR" status --porcelain)" ]]; then
  echo "❌ Working tree nicht clean. Bitte commit/stash."; exit 3
fi

# Fast-forward local branches
git -C "$REPO_DIR" pull --ff-only
git -C "$REPO_DIR" checkout staging >/dev/null 2>&1 || true
git -C "$REPO_DIR" pull --ff-only || true
git -C "$REPO_DIR" checkout main >/dev/null 2>&1

# ====== PROMOTE staging → main (via PR, enforced) ============================
if [[ "$PROMOTE_MODE" == "auto" ]]; then
  # Determine if staging is ahead of main at origin
  set +e
  DIFF_OUT="$(git -C "$REPO_DIR" rev-list --left-right --count \
             ${REMOTE_NAME}/main...${REMOTE_NAME}/staging 2>/dev/null)"
  set -e
  AHEAD_STAGING="$(echo "$DIFF_OUT" | awk '{print $2+0}')"
  if [[ "$AHEAD_STAGING" -gt 0 ]]; then
    TS="$(date +%Y%m%d-%H%M%S)"
    REL_BRANCH="auto/promote-${TS}"
    echo "ℹ️  staging ist $AHEAD_STAGING Commits voraus. Erstelle PR…"

    # Create release branch from remote staging
    git -C "$REPO_DIR" branch -f "$REL_BRANCH" "${REMOTE_NAME}/staging"
    git -C "$REPO_DIR" push -u "$REMOTE_NAME" "$REL_BRANCH" --force

    # Create PR to main and auto-merge (squash) when checks pass
    PR_URL="$(cd "$REPO_DIR" && \
      gh pr create --base main --head "$REL_BRANCH" \
        --title "Promote staging → main ($TS)" \
        --body "Auto-promotion from staging to main: $TS" --repo "$(git remote get-url "$REMOTE_NAME")" \
        2>/dev/null)"
    if [[ -z "${PR_URL:-}" ]]; then
      echo "❌ PR-Erstellung fehlgeschlagen (gh)."; exit 4
    fi
    echo "PR: $PR_URL"

    # Merge (squash); if checks required by branch protection, this waits for them
    cd "$REPO_DIR"
    gh pr merge --squash --delete-branch --auto "$PR_URL" >/dev/null
    echo "✅ PR wird automatisch gemerged, sobald Checks grün sind…"

    # Poll until main contains the PR commit (simple wait loop)
    echo -n "⏳ Warte auf Merge"
    for i in {1..60}; do
      git fetch "$REMOTE_NAME" >/dev/null 2>&1 || true
      MERGED="$(gh pr view "$PR_URL" --json state -q '.state' 2>/dev/null || echo "")"
      [[ "$MERGED" == "MERGED" ]] && break
      echo -n "."
      sleep 2
    done
    echo

    # Refresh local main
    git -C "$REPO_DIR" switch main >/dev/null
    git -C "$REPO_DIR" pull --ff-only
    echo "✅ staging → main Promotion abgeschlossen."
  else
    echo "ℹ️  staging ist nicht voraus. Keine Promotion nötig."
  fi
fi

# ====== BUILD SOURCE: origin/main tarball ====================================
REPO_URL="$(git -C "$REPO_DIR" remote get-url "$REMOTE_NAME")"
REPO_TGZ="${REPO_URL%.git}/archive/refs/heads/main.tar.gz"

# ====== REMOTE DEPLOY ========================================================
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

# Guard: no merge markers in critical file
if egrep -n '^(<<<<<<<|=======|>>>>>>>)' app/page.tsx >/dev/null 2>&1; then
  echo "❌ Merge markers detected in app/page.tsx"; exit 10
fi

echo "==> npm ci"
npm ci --include=dev --no-audit --no-fund
echo "==> npm run build"
npm run build

echo "==> rsync -> $CUR"
rsync -a --delete . "$CUR/"

echo "==> systemctl restart mpathy"
sudo systemctl restart mpathy
sleep 1
systemctl is-active mpathy >/dev/null && echo "✅ mpathy ACTIVE" || { echo "❌ mpathy inactive"; exit 20; }

echo "==> Smoke-Check"
curl -fsS -H 'Host: m-pathy.ai' http://127.0.0.1/ >/dev/null && echo "✅ nginx->next OK"

echo "Stable OK @ $(date -Is) -> $REL" | sudo tee -a "$LOG_DIR/stable.log" >/dev/null || true
echo "==> DONE $(date -Is)"
REMOTE

echo "🎉 Deploy abgeschlossen."
