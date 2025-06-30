#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const obfuscator = require('javascript-obfuscator');
const { execSync } = require('child_process');
const { homedir } = require('os');

const SRC_DIR = path.resolve(process.argv[2] || 'src');
if (!fs.existsSync(SRC_DIR)) throw new Error(`Source directory does not exist: ${SRC_DIR}`);
const TEMP_DIR = fs.existsSync(process.argv[3]) ? path.resolve(process.argv[3]) : path.join(homedir(), 'Desktop', 'temp-build-obfuscated');

const noSign = process.argv.includes('--no-sign');

if(!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.cpSync(SRC_DIR, TEMP_DIR, { recursive: true, force: true });

const obfuscateDir = dir => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && file !== 'node_modules') {
      obfuscateDir(fullPath);
    } else if (file.endsWith('.js')) {
        console.log(`Obfuscating: ${fullPath}`);
      const code = fs.readFileSync(fullPath, 'utf8');
      const obfuscated = obfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
      });
      fs.writeFileSync(fullPath, obfuscated.getObfuscatedCode());
    }
  });

  const gitPath = path.join(dir, '.git');
  const gitignorePath = path.join(dir, '.gitignore');
  if (fs.existsSync(gitPath)) fs.rmSync(gitPath, { recursive: true, force: true });
  if (fs.existsSync(gitignorePath)) fs.unlinkSync(gitignorePath);
};

obfuscateDir(TEMP_DIR);

execSync(` ${ noSign ? 'export CSC_IDENTITY_AUTO_DISCOVERY=false && echo "Skipping sign"' : 'echo "Attempting to sign..."' } && electron-builder -mw --projectDir=${TEMP_DIR}`, { stdio: 'inherit' })

const finalDistPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(finalDistPath)) {
  fs.rmSync(finalDistPath, { recursive: true, force: true });
}
fs.cpSync(path.join(TEMP_DIR, 'dist'), finalDistPath, { recursive: true });
if(!process.argv.includes('--keep-temp')) fs.rmSync(TEMP_DIR, { recursive: true, force: true });