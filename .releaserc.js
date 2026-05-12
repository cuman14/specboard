export default {
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
    // Trigger release workflow after creating tag
    [
      "@semantic-release/exec",
      {
        successCmd:
          'curl -X POST -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/cuman14/specboard/actions/workflows/release.yml/dispatches -d \'{"ref":"main","inputs":{"tag":"${nextRelease.version}"}}\'',
      },
    ],
  ],
};
