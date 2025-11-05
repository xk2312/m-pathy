sudo install -d -m 755 /srv/app/shared/scripts
sudo tee /srv/app/shared/scripts/env.node20.sh >/dev/null <<'SH'
#!/usr/bin/env bash
set -euo pipefail

# Load nvm if available (non-login shells need explicit source)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  # Make sure Node 20 is present and active
  nvm install 20 >/dev/null
  nvm use 20 >/dev/null
else
  echo "WARN: nvm not available for user $USER; continuing with system Node"
fi

# Show versions for logs
command -v node >/dev/null && node -v || echo "node not found"
command -v npm  >/dev/null && npm  -v || echo "npm not found"
SH
sudo chmod 755 /srv/app/shared/scripts/env.node20.sh
