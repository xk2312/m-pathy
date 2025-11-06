#!/usr/bin/env bash
# macOS — One-Command: staging → main (PR/Auto-Merge) → deploy origin/main → prod
# Judges-approved Masterplan (Palantir/Complexity/Colossus)
set -euo pipefail

# ====== CONFIG (local) ========================================================
REPO_DIR="${REPO_DIR:-$HOME/Projekte/m-pathy-staging}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
SSH_HOST="${SSH_HOST:-deploy@188.245.206.61}"
SERVICE="${SERVICE:-mpathy}"
REMOTE_NAME="${REMOTE_NAME:-origin}"
PROMOTE_MODE="${PROMOTE_MODE:-auto}"   # auto|skip  (skip = deploy current origin/main without promotion)
WAIT_SECS="${WAIT_SECS:-180}"          # Max Wartezeit auf PR-Merge

usage() {
  cat <<'HLP'
Usage: deploy_main.sh [--help] [--mode auto|skip]

What it does:
  1) LOCAL SYNC: stimmt lokale 'staging' & 'main' hart auf origin/* ab
  2) PROMOTION:  setzt origin/main = origin/staging (PR + optional Auto-Merge)
  3) DEPLOY:     baut & deployed origin/main@HEAD auf den Prod-Server

Options:
  --help            Show this help and exit
  --mode auto|skip  Promotion step (default: auto)

Environment:
  REPO_DIR, SSH_KEY, SSH_HOST, SERVICE, REMOTE_NAME, PROMOTE_MODE, WAIT_SECS
HLP
}

log() { printf "%s\n" "$*"; }
fail() { printf "❌ %s\n" "$*" >&2; exit 1; }

while [[ "${1:-}" != "" ]]; do
  case "$1" in
    --help) usage; exit 0 ;;
    --mode) shift || true; PROMOTE_MODE="${1:-auto}" ;;
    *) usage; fail "Unknown arg: $1" ;;
  esac
  shift || true
done

# ====== PRECHECKS (local) =====================================================
[[ -d "$REPO_DIR/.git" ]] || fail "Repo nicht gefunden: $REPO_DIR"

# aktives Repo & Remote anzeigen (Transparenz gg. Doppel-Klone)
log "Repo: $REPO_DIR"
ORIGIN_URL="$(git -C "$REPO_DIR" remote get-url "$REMOTE_NAME")"
log "Remote: $ORIGIN_URL"

git -C "$REPO_DIR" fetch --all --prune

CUR_BRANCH="$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)"
if [[ "$CUR_BRANCH" != "main" ]]; then
  log "ℹ️  Auto-switch: '$CUR_BRANCH' → 'main'"
  git -C "$REPO_DIR" switch main >/dev/null
fi

# sauberer Baum
if [[ -n "$(git -C "$REPO_DIR" status --porcelain)" ]]; then
  fail "Working tree nicht clean. Bitte commit/stash."
fi

# ====== LOCAL SYNC (lokal = Remote-Wahrheit) =================================
git -C "$REPO_DIR" fetch --all --prune
git -C "$REPO_DIR" switch staging >/dev/null 2>&1 || true
git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/staging" >/dev/null 2>&1 || true
git -C "$REPO_DIR" switch main >/dev/null
git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main" >/dev/null

sha() { git -C "$REPO_DIR" rev-parse --verify "$1"; }

# ====== PROMOTE staging → main ===============================================
if [[ "$PROMOTE_MODE" == "auto" ]]; then
  # Prüfen, ob origin/staging voraus ist
  DIFF="$(git -C "$REPO_DIR" rev-list --left-right --count ${REMOTE_NAME}/main...${REMOTE_NAME}/staging || true)"
  AHEAD_STAGING="$(awk '{print $2+0}' <<<"$DIFF")"
  if [[ "$AHEAD_STAGING" -gt 0 ]]; then
    log "==> Promote: origin/main ← origin/staging ($AHEAD_STAGING Commits voraus)"

    # Versuch: Fast-Path (wird i. d. R. durch Branchschutz geblockt)
    git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/staging" >/dev/null
    set +e
    git -C "$REPO_DIR" push "$REMOTE_NAME" main
    PUSH_RC=$?
    set -e
    if [[ $PUSH_RC -ne 0 ]]; then
      log "ℹ️  Direct push durch Branchschutz blockiert → PR-Fallback"

      if ! command -v gh >/dev/null 2>&1; then
        fail "GitHub CLI 'gh' fehlt. Installiere: brew install gh && gh auth login"
      fi

      TS="$(date +%Y%m%d-%H%M%S)"
      REL_BRANCH="auto/promote-${TS}"

      # Release-Branch aus origin/staging erstellen & pushen
      git -C "$REPO_DIR" branch -f "$REL_BRANCH" "${REMOTE_NAME}/staging" >/dev/null
      git -C "$REPO_DIR" push -u "$REMOTE_NAME" "$REL_BRANCH" --force >/dev/null

      # PR erzeugen
      cd "$REPO_DIR"
      PR_URL="$(gh pr create --base main --head "$REL_BRANCH" \
        --title "Promote staging → main ($TS)" \
        --body "Auto-promotion from staging to main: $TS" 2>/dev/null || true)"
      [[ -n "${PR_URL:-}" ]] || fail "PR-Erstellung fehlgeschlagen."
      log "PR: $PR_URL"

      # Auto-Merge versuchen (falls erlaubt)
      set +e
      gh pr merge --squash --delete-branch --auto "$PR_URL" >/dev/null
      MERGE_RC=$?
      set -e
      if [[ $MERGE_RC -ne 0 ]]; then
        fail "Auto-Merge nicht erlaubt. Bitte PR manuell mergen: $PR_URL"
      fi

      # Warten bis PR gemerged
      log "⏳ Warte auf Merge (max ${WAIT_SECS}s)…"
      DEADLINE=$(( $(date +%s) + WAIT_SECS ))
      while :; do
        STATE="$(gh pr view "$PR_URL" --json state -q '.state' 2>/dev/null || echo "")"
        [[ "$STATE" == "MERGED" ]] && break
        [[ $(date +%s) -ge $DEADLINE ]] && fail "Timeout: PR noch nicht gemerged ($PR_URL)"
        sleep 2
      done
      log "✅ PR gemerged."
      git -C "$REPO_DIR" fetch --all --prune >/dev/null
      git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main" >/dev/null
    else
      log "✅ origin/main erfolgreich auf origin/staging aktualisiert."
      git -C "$REPO_DIR" fetch --all --prune >/dev/null
      git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main" >/dev/null
    fi
  else
    log "ℹ️  staging ist nicht voraus. Keine Promotion nötig."
  fi
else
  log "ℹ️  PROMOTE_MODE=skip → Promotion übersprungen; deploye aktuellen origin/main."
  git -C "$REPO_DIR" fetch --all --prune >/dev/null
  git -C "$REPO_DIR" reset --hard "${REMOTE_NAME}/main" >/dev/null
fi

# ====== GATE: Invarianten prüfen (SHA-Gleichheit) =============================
SHA_S="$(sha "${REMOTE_NAME}/staging")"
SHA_M="$(sha "${REMOTE_NAME}/main")"
log "SHA (staging): $SHA_S"
log "SHA (main)   : $SHA_M"
[[ "$SHA_S" == "$SHA_M" ]] || fail "Gate verletzt: origin/main != origin/staging (kein Deploy)."

DEPLOY_SHA="$SHA_M"
log "DEPLOY_SHA    : $DEPLOY_SHA"

# ====== BUILD SOURCE (origin/main tarball) ===================================
REPO_URL="$(git -C "$REPO_DIR" remote get-url "$REMOTE_NAME")"
REPO_TGZ="${REPO_URL%.git}/archive/refs/heads/main.tar.gz"

# ====== REMOTE DEPLOY (SERVER) ===============================================
ssh -o IdentitiesOnly=yes -i "$SSH_KEY" "$SSH_HOST" "REPO_TGZ='$REPO_TGZ' DEPLOY_SHA='$DEPLOY_SHA' bash -s" <<'REMOTE'
set -euo pipefail
echo "==> START deploy (origin/main) $(date -Is)"

TS="$(date +%Y%m%d%H%M%S)"
REL="/srv/app/releases/$TS-$DEPLOY_SHA"
CUR="/srv/app/current"
LOG_DIR="/var/log/mpathy"
mkdir -p "$REL" "$LOG_DIR"
cd "$REL"

# --- Node20 + pnpm Bootstrap (idempotent) ---
if [ -f /srv/app/shared/scripts/env.node20.sh ]; then
  . /srv/app/shared/scripts/env.node20.sh
else
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 20 >/dev/null 2>&1 || true
  nvm use 20    >/dev/null 2>&1 || true
fi
corepack enable >/dev/null 2>&1 || true
corepack prepare pnpm@10.14.0 --activate >/dev/null 2>&1 || true
node -v; pnpm -v || true

echo "==> Fetch tarball: $REPO_TGZ"
curl -fsSL "$REPO_TGZ" | tar xz --strip-components=1

# Guard: keine Merge-Marker in kritischer Datei
if egrep -n '^(<<<<<<<|=======|>>>>>>>)' app/page.tsx >/dev/null 2>&1; then
  echo "❌ Merge markers detected in app/page.tsx"; exit 10
fi

echo "==> pnpm install --frozen-lockfile"
pnpm install --frozen-lockfile

echo "==> pnpm build"
pnpm build




echo "==> rsync -> $CUR"
rsync -a --delete . "$CUR/"

echo "==> systemctl restart mpathy"
sudo systemctl restart mpathy
sleep 1
systemctl is-active mpathy >/dev/null && echo "✅ mpathy ACTIVE" || { echo "❌ mpathy inactive"; exit 20; }

echo "==> Smoke-Check"
curl -fsS -H 'Host: m-pathy.ai' http://127.0.0.1/ >/dev/null && echo "✅ nginx->next OK"

echo "Stable OK @ $(date -Is) -> $REL (DEPLOY_SHA=$DEPLOY_SHA)" | sudo tee -a "$LOG_DIR/stable.log" >/dev/null || true
echo "==> DONE $(date -Is)"
REMOTE

echo "🎉 Deploy abgeschlossen."
