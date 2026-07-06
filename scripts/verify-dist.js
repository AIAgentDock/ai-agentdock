'use strict';

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const MAX_BYTES = 24 * 1024 * 1024;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  entries.forEach(function (entry) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
      return;
    }
    files.push(fullPath);
  });

  return files;
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ does not exist. Run: node scripts/build.js');
    process.exit(1);
  }

  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html is missing. Run: node scripts/build.js');
    process.exit(1);
  }

  const files = walk(DIST);
  const oversized = [];

  files.forEach(function (filePath) {
    const size = fs.statSync(filePath).size;
    if (size > MAX_BYTES) {
      oversized.push({ filePath, size });
    }
  });

  if (oversized.length > 0) {
    oversized.forEach(function (item) {
      const mb = (item.size / (1024 * 1024)).toFixed(1);
      console.error('Asset too large (' + mb + ' MiB): ' + path.relative(DIST, item.filePath));
    });
    process.exit(1);
  }

  const totalBytes = files.reduce(function (sum, filePath) {
    return sum + fs.statSync(filePath).size;
  }, 0);

  console.log(
    'dist/ ready: ' +
      files.length +
      ' files, ' +
      (totalBytes / (1024 * 1024)).toFixed(2) +
      ' MiB total (limit ' +
      (MAX_BYTES / (1024 * 1024)) +
      ' MiB per file)'
  );
}

main();
