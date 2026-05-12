#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { detectPlatform, getDownloadUrl } = require('./lib/platform');

const BINARY_DIR = path.join(__dirname, 'node_modules', '.bin');
const BINARY_PATH = path.join(BINARY_DIR, 'specboard-native');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { redirect: 'follow' }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}: ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  // Allow manual binary path override for corporate proxies
  const envBinaryPath = process.env.SPECBOARD_BINARY_PATH;
  if (envBinaryPath) {
    console.log('Using SPECBOARD_BINARY_PATH override:', envBinaryPath);
    if (!fs.existsSync(BINARY_DIR)) {
      fs.mkdirSync(BINARY_DIR, { recursive: true });
    }
    fs.copyFileSync(envBinaryPath, BINARY_PATH);
    fs.chmodSync(BINARY_PATH, 0o755);
    console.log('Binary installed from override path.');
    return;
  }

  try {
    const platformInfo = detectPlatform();
    console.log(`Detected platform: ${platformInfo.platform}-${platformInfo.arch}`);
    console.log(`Expected asset: ${platformInfo.assetName}`);

    // For now, we'll create a placeholder since actual binaries don't exist yet
    // In production, this would download from GitHub Releases
    if (!fs.existsSync(BINARY_DIR)) {
      fs.mkdirSync(BINARY_DIR, { recursive: true });
    }

    // Create a placeholder script that informs the user
    const placeholderScript = platformInfo.rawPlatform === 'win32'
      ? `@echo off\necho Specboard binary not yet available for ${platformInfo.platform}-${platformInfo.arch}\necho Please download manually from: ${getDownloadUrl(platformInfo)}\nexit 1\n`
      : `#!/bin/sh\necho "Specboard binary not yet available for ${platformInfo.platform}-${platformInfo.arch}"\necho "Please download manually from: ${getDownloadUrl(platformInfo)}"\nexit 1\n`;

    fs.writeFileSync(BINARY_PATH, placeholderScript);
    fs.chmodSync(BINARY_PATH, 0o755);

    console.log('Placeholder created. Binary will be available after first GitHub Release.');
    console.log('Download URL would be:', getDownloadUrl(platformInfo));

  } catch (error) {
    console.error('Error during postinstall:', error.message);
    console.error('');
    console.error('You can manually specify a binary path using:');
    console.error('  SPECBOARD_BINARY_PATH=/path/to/specboard npm install -g specboard');
    process.exit(1);
  }
}

main();
