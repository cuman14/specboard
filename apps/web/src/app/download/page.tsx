'use client';

import { useOSDetection, getDownloadAsset, OSPlatform } from '../../hooks/useOSDetection';
import { DownloadButton, CopyButton } from '../../components/DownloadButton';

const VERSION = '0.1.0';

const ALL_PLATFORMS: OSPlatform[] = ['macos', 'windows', 'linux'];

export default function DownloadPage() {
  const { platform, isMobile } = useOSDetection();
  const primaryAsset = getDownloadAsset(platform, VERSION);

  return (
    <div className="download-page">
      <header>
        <h1>Download Specboard</h1>
        <p className="version">Version {VERSION}</p>
      </header>

      <main>
        {/* Primary Download - OS Detected */}
        <section className="primary-download">
          <h2>{platform !== 'unknown' ? `Download for ${platform.charAt(0).toUpperCase() + platform.slice(1)}` : 'Choose Your Platform'}</h2>
          
          {platform !== 'unknown' && (
            <DownloadButton
              platform={platform}
              version={VERSION}
              downloadUrl={primaryAsset.url}
              extension={primaryAsset.extension}
              isPrimary={true}
            />
          )}

          <div className="install-instructions">
            <h3>Installation Instructions</h3>
            <p>{primaryAsset.installInstructions}</p>
          </div>

          {isMobile && (
            <div className="mobile-warning">
              <p>⚠️ Specboard is a desktop application. Please download it on your computer.</p>
            </div>
          )}
        </section>

        {/* npm Install Command */}
        <section className="npm-install">
          <h2>Or Install via npm</h2>
          <CopyButton 
            text="npm install -g specboard" 
            label="Copy install command"
          />
          <p className="npm-description">
            Requires <a href="https://nodejs.org">Node.js</a> 16+. 
            The npm package will download the correct binary for your platform automatically.
          </p>
        </section>

        {/* All Platforms Fallback */}
        <section className="all-platforms">
          <h2>All Downloads</h2>
          <div className="platform-grid">
            {ALL_PLATFORMS.map((p) => {
              const asset = getDownloadAsset(p, VERSION);
              return (
                <DownloadButton
                  key={p}
                  platform={p}
                  version={VERSION}
                  downloadUrl={asset.url}
                  extension={asset.extension}
                  isPrimary={false}
                />
              );
            })}
          </div>
        </section>

        {/* GitHub Releases Link */}
        <section className="github-link">
          <p>
            Looking for a specific version?{' '}
            <a href={`https://github.com/specboard/specboard/releases`}>
              View all releases on GitHub →
            </a>
          </p>
        </section>
      </main>

      <footer>
        <p>
          Having trouble? See the{' '}
          <a href="/docs/installation">installation guide</a> or{' '}
          <a href="https://github.com/specboard/specboard/issues">report an issue</a>.
        </p>
      </footer>

      <style jsx>{`
        .download-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        header {
          text-align: center;
          margin-bottom: 3rem;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #6366f1;
        }

        .version {
          color: #666;
          font-size: 1.1rem;
        }

        section {
          margin-bottom: 3rem;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #555;
        }

        .primary-download {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .install-instructions {
          margin-top: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #6366f1;
        }

        .mobile-warning {
          margin-top: 1rem;
          padding: 1rem;
          background: #fff3cd;
          border-radius: 8px;
          color: #856404;
        }

        .npm-install {
          text-align: center;
        }

        .npm-description {
          margin-top: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .github-link {
          text-align: center;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
          color: #666;
        }

        a {
          color: #6366f1;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
