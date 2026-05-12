export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/cuman14/specboard.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/exec",
      {
        prepareCmd: "node scripts/sync-versions.js ${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "package.json",
          "CHANGELOG.md",
          "src-tauri/Cargo.toml",
          "src-tauri/tauri.conf.json",
          "scoop/specboard.json",
          "homebrew/specboard.rb",
        ],
      },
    ],
    "@semantic-release/github",
  ],
};
