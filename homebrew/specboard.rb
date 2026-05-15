# frozen_string_literal: true

class Specboard < Formula
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  version "0.3.2"

  # Apple Silicon (arm64) — M1/M2/M3/M4
  # Intel: no disponible por limitaciones del runner de CI.
  on_arm do
    url "https://github.com/cuman14/specboard/releases/download/v0.3.1/Specboard_0.3.1_aarch64.dmg"
    sha256 "7884dc305c7c19441c2fe77dcc2719bb09aca29737bc37046c6026566ed8f89b"
  end

  license "MIT"

  app "Specboard.app"

  zap trash: [
    "~/Library/Application Support/com.specboard.app",
    "~/Library/Caches/com.specboard.app",
    "~/Library/Preferences/com.specboard.app.plist",
    "~/Library/Saved Application State/com.specboard.app.savedState"
  ]
end
