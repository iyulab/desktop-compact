# Changelog

All notable changes to `@iyulab/desktop-compact` are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) (while the version is `0.x`, a minor
release may change the API). Releases up to 0.8.2 are recorded in the git history.

## [Unreleased]

### Added

- Design tokens for hierarchy and depth: a raised surface, a rule color, a secondary hue (`--dc-color-secondary`,
  `-text`, `-contrast`), subtle grounds for every fill (`--dc-color-*-subtle`), `xl`/`2xl`/`display` font sizes,
  line heights, a bold weight and three elevations.
- Role tokens (`--dc-page-*`, `--dc-section-*`, `--dc-card-*`, `--dc-field-*`, `--dc-metric-*`, `--dc-table-*`,
  `--dc-indicator-color`, `--dc-selection-bg`): components read these, and an app themes a role by overriding one
  token. Their defaults reproduce the previous look.
- `dc-badge` `secondary` variant; tinted variants read `--dc-color-*-subtle`.
- `dc-card` `header` and `footer` slots, drawn only when filled; the card reads `--dc-card-*` role tokens.
- `dc-section-heading` `marker`; title weight and description color read role tokens.

### Changed

- `tokens.css` defines `--dc-dialog-max-width` (480px, the dialog's default), so the token check passes on
  code that reads it; setting it on a `dc-dialog` still overrides it per dialog.

## [0.9.1] - 2026-10-01

### Added

- `--dc-font-mono` token for fixed-width text (codes, keys, paths, keyboard shortcuts).

## [0.9.0] - 2026-10-01

### Added

- `desktop-compact-check-tokens` command: fails when code reads a `--dc-*` design token that neither
  this package's `tokens.css` nor any stylesheet passed with `--defined` defines, so a mistyped or
  removed token no longer falls back silently.

### Changed

- `npm pack` builds first, so a locally packed tarball never carries a stale `dist`.
- The package declares its repository and is published with provenance.
