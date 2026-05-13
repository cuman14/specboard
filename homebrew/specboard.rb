# frozen_string_literal: true

class Specboard < Formula
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  url "https://github.com/cuman14/specboard/releases/download/v0.1.2/specboard_0.1.2_x64.dmg"
  sha256 "f7456864d8069f0ddbcf4dd8a388d6f82c2a452a849a442d44d61013f2e7883e"
  license "MIT"

  app "Specboard.app"

  zap trash: [
    "~/Library/Application Support/com.specboard.app",
    "~/Library/Caches/com.specboard.app",
    "~/Library/Preferences/com.specboard.app.plist",
    "~/Library/Saved Application State/com.specboard.app.savedState"
  ]
end
