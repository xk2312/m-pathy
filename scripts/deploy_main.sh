#!/usr/bin/env bash
# macOS — One-Command: promote staging→main, then deploy main→prod
set -euo pipefail

# ====== CONFIG (local) ========================================================
REPO_DIR="${REPO_DIR:-$HOME/Projekte/m-pathy-staging}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
SSH_HOST="${SSH_HOST:-deploy@188.245.206.61}"
SERVICE="${SERVICE:-mpathy}"
REMOTE_NAME="${REMOTE_NAME:-origin}"         # Git remote name
PROMOTE_MODE="${PROMOTE_MODE:-auto}"         # auto|skip  (skip = deploy current origin/main without promotion)

usage() {
  cat <<'HLP'
Usage: deploy_main.sh [--help] [--mode auto|skip]

What it does:
  1) LOCAL SYNC: forces your local 'main' and 'staging' to match the remote (origin/*)
  2) PROMOTION:  sets origin/main = origin/staging (direct push if allowed, else PR+merge)
  3) DEPLOY:     builds and deploys origin/main to the production server

Options:
  --help            Show this help and exit
  --mode auto|skip  Promotion step (default: auto)

Environment:
  REPO_DIR, SSH_KEY, SSH_HOST, SERVICE, REMOTE_NAME, PROMOTE_MODE
HLP
}

while [[ "${1:-}" != "" ]]; do
  case "$1" in
    --help) usage; exit 0 ;;
    --mode) shift; PROMOTE_MODE="${1:-auto}" ;;
    *) echo "Unknown arg: $1"; usage; exit 64 ;;
  esac
  shift || true
done

# ====== PRECHECKS (local) =====================================================
if [[ ! -d "$REPO_DIR/.git" ]]; then
  echo "❌ Repo nicht gefunden: $REPO_DIR"; exit 1
fi

# Must be on main and clean (we’ll hard-sync branches right after)
git -C "$REPO_DIR" fetch --all --prune
CUR_BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)"

# Wenn nicht auf main: bei cleanem Baum automatisch umschalten.
if [[ "$CUR_BRANCH" != "main" ]]; then
  if [[ -z "$(git -C "$REPO_DIR" status --porcelain)" ]]; then
    echo "ℹ️  Auto-switch: '$CUR_BRANCH' → 'main'"
    git -C "$REPO_DIR" switch main >/dev/null
  else
    echo "❌ Du bist auf '$CUR_BRANCH' und der Working Tree ist nicht clean."
    echo "   Bitte commit/stash oder wechsle manuell auf 'main'."
    exit 2
  fi
fi

# (Sicherheitscheck bleibt bestehen)
if [[ -n "$(git -C "$REPO_DIR" status --porcelain)" ]]; then
  echo "❌ Working tree nicht clean. Bitte commit/stash."; exit 3
fi


# ====== LOCAL SYNC (force local branches to match remotes) ====================
# So sieht VS Code genau das, was wirklich auf origin/* liegt.
git -C "$REPO_DIR" fetch --all --prune
git -C "$REPO_DIR" switch staging >/dev/null 2>&1 || true
git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/staging" 2>/dev/null || true
git -C "$REPO_DIR" switch main >/dev/null
git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main"

# ====== PROMOTE staging → main ===============================================
if [[ "$PROMOTE_MODE" == "auto" ]]; then
  # We want origin/main to become origin/staging (i.e. deploy latest staging)
  echo "==> Promote: origin/main ← origin/staging"

  # Try fast path: set local main = origin/staging and push
  git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/staging"
  set +e
  git -C "$REPO_DIR" push "$REMOTE_NAME" main
  PUSH_RC=$?
  set -e
  if [[ $PUSH_RC -ne 0 ]]; then
    echo "ℹ️  Direct push blocked by branch protection. Falling back to PR."
    if ! command -v gh >/dev/null 2>&1; then
      echo "❌ GitHub CLI 'gh' fehlt. Installiere: brew install gh && gh auth login"; exit 4
    fi
    TS="$(date +%Y%m%d-%H%M%S)"
    REL_BRANCH="auto/promote-${TS}"

    # Create the branch from origin/staging and push it
    git -C "$REPO_DIR" branch -f "$REL_BRANCH" "${REMOTE_NAME}/staging"
    git -C "$REPO_DIR" push -u "$REMOTE_NAME" "$REL_BRANCH" --force

    # Create PR to main
    cd "$REPO_DIR"
    PR_URL="$(gh pr create --base main --head "$REL_BRANCH" \
      --title "Promote staging → main ($TS)" \
      --body "Auto-promotion from staging to main: $TS" 2>/dev/null || true)"
    if [[ -z "${PR_URL:-}" ]]; then
      echo "❌ PR-Erstellung fehlgeschlagen."; exit 5
    fi
    echo "PR: $PR_URL"

    # Try auto-merge; if not allowed, this will exit non-zero
    set +e
    gh pr merge --squash --delete-branch --auto "$PR_URL"
    MERGE_RC=$?
    set -e
    if [[ $MERGE_RC -ne 0 ]]; then
      echo "ℹ️  Auto-merge nicht erlaubt. Bitte PR manuell mergen, dann erneut 'deploy-main' ausführen."
      exit 6
    fi

    # Wait for merge
    echo -n "⏳ Warte auf Merge"
    for i in {1..90}; do
      STATE="$(gh pr view "$PR_URL" --json state -q '.state' 2>/dev/null || echo "")"
      [[ "$STATE" == "MERGED" ]] && break
      echo -n "."
      sleep 2
    done
    echo

    # Refresh local branches to remote truth
    git -C "$REPO_DIR" fetch --all --prune
    git -C "$REPO_DIR" switch main >/dev/null
    git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main"
    git -C "$REPO_DIR" switch staging >/dev/null 2>&1 || true
    git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/staging" 2>/dev/null || true
    git -C "$REPO_DIR" switch main >/dev/null
  else
    echo "✅ origin/main erfolgreich auf origin/staging aktualisiert."
    # Re-sync local to remote main we just pushed
    git -C "$REPO_DIR" fetch --all --prune
    git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main"
  fi
else
  echo "ℹ️  PROMOTE_MODE=skip → überspringe Promotion; deploye aktuellen origin/main."
  git -C "$REPO_DIR" fetch --all --prune
  git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main"
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

echo "==> Fetch tarball: $REPO_TGZ"
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
