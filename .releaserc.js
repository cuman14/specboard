module.exports = {
  branches: ["main"],
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
    "@semantic-release/git",
    "@semantic-release/github",
  ],
};
