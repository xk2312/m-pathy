#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, rmSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ---- config aus ENV (Secrets) ----
const {
  SSH_HOST,
  SSH_PORT = '22',
  SSH_USER = 'deploy',
  HETZNER_SSH_KEY = '',       // privater Schlüsselinhalt (BEGIN/END)
  AZURE_OPENAI_ENDPOINT = '',
  AZURE_OPENAI_API_KEY = '',
  AZURE_OPENAI_DEPLOYMENT = '',
  AZURE_OPENAI_API_VERSION = '2024-06-01',
} = process.env;

const SERVICE_NAME = 'm-pathy';
const REMOTE_ENV = '/etc/m-pathy.env';
const REMOTE_DIR = '/srv/m-pathy';
const ARCHIVE_NAME = 'm-pathy.tar.gz';

// ---- kleine Helfer ----
const sh = (cmd, opts = {}) => {
  console.log(`\n$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
};

const die = (msg) => {
  console.error(`\n❌ ${msg}`);
  process.exit(1);
};

// ---- 0) Import-Guard: verbiete "@/..." im app/-Ordner ----
try {
  const out = execSync(`grep -R --line-number --include="*.ts" --include="*.tsx" "@/[^']*" app/ || true`, { encoding: 'utf8' });
  if (out.trim()) {
    console.error('\n❌ Gefundene verbotene Alias-Imports innerhalb von app/:');
    console.error(out);
    die('Bitte ersetze "@/..." in app/ durch relative Imports (../ oder ./).');
  }
} catch (e) {
  // ignore
}

// ---- 1) Node/Next-Version ausgeben ----
sh('node -v');
sh('npm -v');

// ---- 2) Build (bricht sofort bei Fehlern) ----
sh('npm ci --omit=dev');      // reproduzierbare Prod-Install (CI)
sh('npm run build');          // next build

// ---- 3) Packen (stabile Snapshot-Variante) ----
const work = mkdtempSync(join(tmpdir(), 'mpathy-'));
const pkgDir = join(work, 'package-src');

sh(`mkdir -p "${pkgDir}"`);
sh(`rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next/cache' \
  ./ "${pkgDir}/"`);

sh(`tar -C "${pkgDir}" -czf "${ARCHIVE_NAME}" .`);

// ---- 4) SSH Key temporär anlegen ----
const sshKeyPath = join(work, 'id_deploy');
writeFileSync(sshKeyPath, HETZNER_SSH_KEY, { mode: 0o600 });

// ---- 5) Upload nach /tmp und deployen ----
const SSH_BASE = `-i "${sshKeyPath}" -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new`;

sh(`scp ${SSH_BASE} "${ARCHIVE_NAME}" ${SSH_USER}@${SSH_HOST}:/tmp/${ARCHIVE_NAME}`);

const remoteScript = `
set -e
sudo mkdir -p ${REMOTE_DIR}
sudo tar -C ${REMOTE_DIR} -xzf /tmp/${ARCHIVE_NAME}
sudo rm -f /tmp/${ARCHIVE_NAME}

sudo bash -c 'cat > ${REMOTE_ENV}' <<'EOF'
AZURE_OPENAI_ENDPOINT=${AZURE_OPENAI_ENDPOINT}
AZURE_OPENAI_API_KEY=${AZURE_OPENAI_API_KEY}
AZURE_OPENAI_DEPLOYMENT=${AZURE_OPENAI_DEPLOYMENT}
AZURE_OPENAI_API_VERSION=${AZURE_OPENAI_API_VERSION}
NODE_ENV=production
PORT=3000
EOF
sudo chmod 600 ${REMOTE_ENV}

cd ${REMOTE_DIR}
sudo npm ci --omit=dev
sudo systemctl daemon-reload || true
sudo systemctl restart ${SERVICE_NAME}
sudo systemctl status ${SERVICE_NAME} --no-pager -l | head -n 50
`;

sh(`ssh ${SSH_BASE} ${SSH_USER}@${SSH_HOST} '${remoteScript.replaceAll('\n', ' ')}'`);

// ---- 6) Cleanup local tmp ----
try { rmSync(work, { recursive: true, force: true }); } catch {}

// ---- Done ----
console.log('\n✅ Deploy erfolgreich abgeschlossen.');
