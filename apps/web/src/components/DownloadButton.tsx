'use client';

import { useState } from 'react';
import { OSPlatform } from '../hooks/useOSDetection';

interface DownloadButtonProps {
  platform: OSPlatform;
  version: string;
  downloadUrl: string;
  extension: string;
  isPrimary?: boolean;
}

export function DownloadButton({ 
  platform, 
  version, 
  downloadUrl, 
  extension,
  isPrimary = false 
}: DownloadButtonProps) {
  const platformLabels: Record<OSPlatform, string> = {
    macos: 'macOS',
    windows: 'Windows',
    linux: 'Linux',
    unknown: 'Unknown'
  };

  const platformIcons: Record<OSPlatform, string> = {
    macos: '🍎',
    windows: '🪟',
    linux: '🐧',
    unknown: '💻'
  };

  return (
    <a
      href={downloadUrl}
      className={`download-button ${isPrimary ? 'primary' : 'secondary'}`}
      download
    >
      <span className="icon">{platformIcons[platform]}</span>
      <span className="text">
        Download for {platformLabels[platform]}
        <span className="version">.{extension} • v{version}</span>
      </span>
    </a>
  );
}

interface CopyButtonProps {
  text: string;
  label: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copied' : ''}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      <code>{text}</code>
      <span className="copy-icon">{copied ? '✓' : '📋'}</span>
      <span className="copy-label">{copied ? 'Copied!' : label}</span>
    </button>
  );
}
