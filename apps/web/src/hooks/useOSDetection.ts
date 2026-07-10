import { useState, useEffect } from 'react';

export type OSPlatform = 'macos' | 'windows' | 'linux' | 'unknown';

export interface OSDetection {
  platform: OSPlatform;
  isMobile: boolean;
  userAgent: string;
}

export function useOSDetection(): OSDetection {
  const [detection, setDetection] = useState<OSDetection>({
    platform: 'unknown',
    isMobile: false,
    userAgent: ''
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    let detectedPlatform: OSPlatform = 'unknown';
    let isMobile = false;

    // Check for mobile devices first
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      isMobile = true;
    }

    // Detect OS
    if (/macintosh|mac os x/i.test(userAgent) || platform.includes('mac')) {
      detectedPlatform = 'macos';
    } else if (/windows|win32|win64/i.test(userAgent) || platform.includes('win')) {
      detectedPlatform = 'windows';
    } else if (/linux|x11/i.test(userAgent) || platform.includes('linux')) {
      detectedPlatform = 'linux';
    }

    setDetection({
      platform: detectedPlatform,
      isMobile,
      userAgent: navigator.userAgent
    });
  }, []);

  return detection;
}

export function getDownloadAsset(platform: OSPlatform, version: string = '0.1.0'): {
  name: string;
  extension: string;
  url: string;
  installInstructions: string;
} {
  const repoOwner = 'specboard';
  const repoName = 'specboard';
  
  const assets: Record<OSPlatform, { name: string; extension: string; installInstructions: string }> = {
    macos: {
      name: `specboard_${version}_darwin_x64`,
      extension: 'dmg',
      installInstructions: 'Open the .dmg file and drag Specboard to your Applications folder.'
    },
    windows: {
      name: `specboard_${version}_windows_x64`,
      extension: 'msi',
      installInstructions: 'Run the .msi installer and follow the installation wizard.'
    },
    linux: {
      name: `specboard_${version}_linux_x64`,
      extension: 'AppImage',
      installInstructions: 'Make the AppImage executable with chmod +x and run it.'
    },
    unknown: {
      name: `specboard_${version}_linux_x64`,
      extension: 'AppImage',
      installInstructions: 'Select your platform below.'
    }
  };

  const asset = assets[platform] || assets.unknown;
  const url = `https://github.com/${repoOwner}/${repoName}/releases/download/v${version}/${asset.name}.${asset.extension}`;

  return {
    ...asset,
    url
  };
}
