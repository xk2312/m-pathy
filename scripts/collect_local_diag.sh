#!/usr/bin/env bash
set -euo pipefail

OUT="mpathy_local_diag_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT"

# Basisinfos
echo "===== VERSIONS =====" > "$OUT/00_env.txt"
echo "PWD: $(pwd)" >> "$OUT/00_env.txt"
node -v >> "$OUT/00_env.txt" 2>&1 || true
npm -v  >> "$OUT/00_env.txt"  2>&1 || true
git --version >> "$OUT/00_env.txt" 2>&1 || true

# Git-Zustand
git rev-parse --abbrev-ref HEAD > "$OUT/01_git.txt" 2>&1 || true
{
  echo "---- git status ----"
  git status
  echo
  echo "---- git remote -v ----"
  git remote -v
} >> "$OUT/01_git.txt" 2>&1 || true

# Projektstruktur (oberflächlich)
( command -v tree >/dev/null && tree -L 3 app || find app -maxdepth 3 -type f | sort ) > "$OUT/02_app_tree.txt" 2>&1 || true

# Kritische Dateien (ohne Secrets)
for f in \
  package.json \
  next.config.js \
  tsconfig.json \
  .gitignore \
  app/page.tsx \
  app/page2/page.tsx \
  app/components/CanvasMeteorAndM.tsx \
  app/components/ZenithButton.tsx \
  app/components/LogoM.tsx \
  .github/workflows/deploy.yml \
  orchestrator.js
do
  if [ -f "$f" ]; then
    mkdir -p "$OUT/files/$(dirname "$f")"
    cp "$f" "$OUT/files/$f"
  fi
done

# Alias-Checks in app/ (häufige Fehlerquelle)
{
  echo "===== SEARCH '@/styles' & '@/components' IN app/ ====="
  grep -R --line-number --include="*.ts" --include="*.tsx" "@/styles" app/ || true
  grep -R --line-number --include="*.ts" --include="*.tsx" "@/components" app/ || true
  echo "===== SEARCH '@/…' GENERIC ====="
  grep -R --line-number --include="*.ts" --include="*.tsx" "@/" app/ || true
} > "$OUT/03_alias_scan.txt" 2>&1

# Build-Logs (lokal, ohne zu brechen, optional)
{
  echo "===== npm ci (dry-run style) ====="
  npm ci --dry-run || true
  echo
  echo "===== next build (—help only; KEIN Buildlauf) ====="
  npx next --help || true
} > "$OUT/04_local_checks.txt" 2>&1

tar -czf "${OUT}.tar.gz" "$OUT"
echo ">> Local diagnostics written to: ${OUT}.tar.gz"
