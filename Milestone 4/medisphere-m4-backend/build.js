/**
 * build.js
 *
 * Builds the Milestone 4 frontend and copies its output into
 * ./public so the backend can serve the whole app as a single
 * process on a single link. Written in plain Node (no shell-specific
 * commands) so it works the same on Windows, macOS and Linux.
 *
 * Usage: npm run build   (run from medisphere-m4-backend/)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'medisphere-m4-frontend');
const FRONTEND_DIST = path.join(FRONTEND_DIR, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');

function run(cmd, cwd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(FRONTEND_DIR)) {
  console.error(`Could not find the frontend at ${FRONTEND_DIR}`);
  console.error('Expected medisphere-m4-frontend/ to sit next to medisphere-m4-backend/.');
  process.exit(1);
}

if (!fs.existsSync(path.join(FRONTEND_DIR, 'node_modules'))) {
  run('npm install', FRONTEND_DIR);
}

run('npm run build', FRONTEND_DIR);

if (fs.existsSync(PUBLIC_DIR)) {
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
}
copyRecursive(FRONTEND_DIST, PUBLIC_DIR);

console.log(`\nFrontend built and copied into ${PUBLIC_DIR}`);
console.log('Run "npm start" and open http://localhost:4001 (or your PORT) -- one process, one link.');
