const os = require('os');

const PLATFORM_MAP = {
  'linux': 'linux',
  'darwin': 'darwin',
  'win32': 'windows'
};

const ARCH_MAP = {
  'x64': 'x64',
  'arm64': 'arm64',
  'ia32': 'x86'
};

const ASSET_EXTENSIONS = {
  'linux': 'AppImage',
  'darwin': 'dmg',
  'win32': 'msi'
};

function detectPlatform() {
  const platform = process.platform;
  const arch = process.arch;

  const mappedPlatform = PLATFORM_MAP[platform];
  const mappedArch = ARCH_MAP[arch];

  if (!mappedPlatform || !mappedArch) {
    throw new Error(
      `Unsupported platform: ${platform}-${arch}. ` +
      `Supported platforms: linux-x64, linux-arm64, darwin-x64, darwin-arm64, windows-x64`
    );
  }

  const extension = ASSET_EXTENSIONS[platform];
  const version = require('../package.json').version;
  const assetName = `specboard_${version}_${mappedPlatform}_${mappedArch}.${extension}`;

  return {
    platform: mappedPlatform,
    arch: mappedArch,
    rawPlatform: platform,
    rawArch: arch,
    extension,
    assetName,
    version
  };
}

function getDownloadUrl(platformInfo, repoOwner = 'specboard', repoName = 'specboard') {
  const { version, assetName } = platformInfo;
  return `https://github.com/${repoOwner}/${repoName}/releases/download/v${version}/${assetName}`;
}

module.exports = {
  detectPlatform,
  getDownloadUrl,
  PLATFORM_MAP,
  ARCH_MAP,
  ASSET_EXTENSIONS
};
