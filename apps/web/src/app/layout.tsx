import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download Specboard - OpenSpec GUI',
  description: 'Download Specboard, the visual GUI for OpenSpec Spec-Driven Development framework. Available for macOS, Windows, and Linux.',
  keywords: ['specboard', 'openspec', 'download', 'tauri', 'sdd'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
