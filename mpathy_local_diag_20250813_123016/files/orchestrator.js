const { execSync } = require('node:child_process');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const env = process.env;
const SSH_HOST = env.SSH_HOST;
const SSH_PORT = env.SSH_PORT || '22';
const SSH_USER = env.SSH_USER || 'deploy';
const HETZNER_SSH_KEY = env.HETZNER_SSH_KEY || '';

const AZURE_OPENAI_ENDPOINT   = env.AZURE_OPENAI_ENDPOINT   || '';
const AZURE_OPENAI_API_KEY    = env.AZURE_OPENAI_API_KEY    || '';
const AZURE_OPENAI_DEPLOYMENT = env.AZURE_OPENAI_DEPLOYMENT || '';
const AZURE_OPENAI_API_VERSION= env.AZURE_OPENAI_API_VERSION|| '2024-06-01';

if (!SSH_HOST || !HETZNER_SSH_KEY) {
  console.error('❌ Missing SSH_HOST or HETZNER_SSH_KEY env. Set GitHub Secrets.');
  process.exit(1);
}

const SERVICE = 'm-pathy';
const REMOTE_DIR = '/srv/m-pathy';
const REMOTE_ENV = '/etc/m-pathy.env';
const ARCHIVE = 'm-pathy.tar.gz';

const sh = (cmd) => { console.log(`\n$ ${cmd}`); execSync(cmd, { stdio: 'inherit' }); };

try {
  // Guard: verbiete "@/..." Importe in app/
  try {
    const found = execSync(`grep -R --line-number --include="*.ts" --include="*.tsx" "@/[^']*" app/ || true`, { encoding: 'utf8' });
    if (found.trim()) {
      console.error('\n❌ Verbotene Alias-Imports in app/:');
      console.error(found);
      console.error('Bitte ersetze "@/..." in app/ durch relative Importe (./ oder ../).');
      process.exit(1);
    }
  } catch (_) {}

  // Build lokal im Runner
  sh('node -v');
  sh('npm -v');
  sh('npm ci');
  sh('npm run build');

  // Stabiles Snapshot-Packaging
  const work = mkdtempSync(join(tmpdir(), 'mpathy-'));
  const pkg = join(work, 'package-src');
  sh(`mkdir -p "${pkg}"`);
  sh(`rsync -a --delete --exclude='.git' --exclude='node_modules' --exclude='.next/cache' ./ "${pkg}/"`);
  sh(`tar -C "${pkg}" -czf "${ARCHIVE}" .`);

  // SSH Key temporär schreiben
  const keyPath = join(work, 'id_deploy');
  writeFileSync(keyPath, HETZNER_SSH_KEY, { mode: 0o600 });

  const SSH_BASE = `-i "${keyPath}" -p ${SSH_PORT} -o StrictHostKeyChecking=accept-new`;

  // Upload
  sh(`scp ${SSH_BASE} "${ARCHIVE}" ${SSH_USER}@${SSH_HOST}:/tmp/${ARCHIVE}`);

  // Remote deploy
  const remote = [
    'set -e',
    `sudo mkdir -p ${REMOTE_DIR}`,
    `sudo tar -C ${REMOTE_DIR} -xzf /tmp/${ARCHIVE}`,
    `sudo rm -f /tmp/${ARCHIVE}`,
    `sudo bash -c 'cat > ${REMOTE_ENV}' <<'EOF'`,
    `AZURE_OPENAI_ENDPOINT=${AZURE_OPENAI_ENDPOINT}`,
    `AZURE_OPENAI_API_KEY=${AZURE_OPENAI_API_KEY}`,
    `AZURE_OPENAI_DEPLOYMENT=${AZURE_OPENAI_DEPLOYMENT}`,
    `AZURE_OPENAI_API_VERSION=${AZURE_OPENAI_API_VERSION}`,
    `NODE_ENV=production`,
    `PORT=3000`,
    `EOF`,
    `sudo chmod 600 ${REMOTE_ENV}`,
    `cd ${REMOTE_DIR}`,
    `npm ci --omit=dev`,
    `sudo systemctl daemon-reload || true`,
    `sudo systemctl restart ${SERVICE}`,
    `sudo systemctl status ${SERVICE} --no-pager -l | head -n 50 || true`,
  ].join(' && ');
  sh(`ssh ${SSH_BASE} ${SSH_USER}@${SSH_HOST} '${remote.replace(/'/g, `'\\''`)}'`);

  // Cleanup
  try { rmSync(work, { recursive: true, force: true }); } catch {}
  console.log('\n✅ Deploy erfolgreich abgeschlossen.');
} catch (e) {
  console.error('\n❌ Deploy fehlgeschlagen.');
  process.exit(1);
}
