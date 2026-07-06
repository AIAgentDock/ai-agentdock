'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;

function run(command) {
  execSync(command, { cwd: ROOT, stdio: 'inherit', env: process.env });
}

if (!fs.existsSync(path.join(ROOT, 'scripts', 'build.js'))) {
  console.error('scripts/build.js not found. Check Cloudflare Builds "Root directory" is empty (repo root).');
  process.exit(1);
}

run('node scripts/build.js');
run('node scripts/verify-dist.js');
run('npx wrangler deploy --config wrangler.jsonc');
