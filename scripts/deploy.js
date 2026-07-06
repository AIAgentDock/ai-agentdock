'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function run(command) {
  execSync(command, { cwd: ROOT, stdio: 'inherit', env: process.env });
}

run('node scripts/build.js');
run('node scripts/verify-dist.js');
run('npx wrangler deploy --config wrangler.jsonc');
