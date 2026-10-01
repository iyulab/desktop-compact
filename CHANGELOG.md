# Changelog

All notable changes to `@iyulab/desktop-compact` are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) (while the version is `0.x`, a minor
release may change the API). Releases up to 0.8.2 are recorded in the git history.

## [Unreleased]

## [0.9.0] - 2026-10-01

### Added

- `desktop-compact-check-tokens` command: fails when code reads a `--dc-*` design token that neither
  this package's `tokens.css` nor any stylesheet passed with `--defined` defines, so a mistyped or
  removed token no longer falls back silently.

### Changed

- `npm pack` builds first, so a locally packed tarball never carries a stale `dist`.
- The package declares its repository and is published with provenance.
