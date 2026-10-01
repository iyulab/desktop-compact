# Changelog

All notable changes to `@iyulab/desktop-compact` are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) (while the version is `0.x`, a minor
release may change the API). Releases up to 0.8.2 are recorded in the git history.

## [Unreleased]

### Fixed

- `dc-empty-state` no longer renders an empty `<h2>` when `heading` is empty; the heading element appears only when a heading is set.

## [0.10.0] - 2026-10-01

### Added

- `tableStyles` (`@iyulab/desktop-compact/table-styles`): shared styles for a semantic `<table>` in a component's shadow root — header row, row headers, numeric cells (`.num`), a totals footer — over the `--dc-table-*` role tokens. `dc-data-table` reads the same table role tokens (rendering is unchanged by default).
- Design tokens for hierarchy and depth: a raised surface, a rule color, a secondary hue (`--dc-color-secondary`,
  `-text`, `-contrast`), subtle grounds for every fill (`--dc-color-*-subtle`), `xl`/`2xl`/`display` font sizes,
  line heights, a bold weight and three elevations.
- Role tokens (`--dc-page-*`, `--dc-section-*`, `--dc-card-*`, `--dc-field-*`, `--dc-metric-*`, `--dc-table-*`,
  `--dc-indicator-color`, `--dc-selection-bg`): components read these, and an app themes a role by setting one
  token. `tokens.css` declares them (`@property`, no value) rather than giving them values, as it does the rule
  color and the subtle grounds; unset, each component falls back to the base tokens where it sits, so the
  previous look is unchanged and overriding a base token (`--dc-color-surface`, `--dc-color-accent`, …) on any
  subtree still reaches every component inside it. `tokens.css` lists what each role resolves to.
- `dc-badge` `secondary` variant; tinted variants read `--dc-color-*-subtle`.
- `dc-card` `header` and `footer` slots, drawn only when filled; the card reads `--dc-card-*` role tokens.
- `dc-section-heading` `marker`; title weight and description color read role tokens.
- `dc-field`: a label, required mark, hint and error around one control; clicking the label focuses the control.
- `dc-callout`: an info, success, warning or danger note with an edge, a subtle ground and an actions slot.
- `dc-metric`: a figure on a card with a label, unit, an optional accent band and a line under it.
- Storybook `Foundations/Hierarchy` and `BrandOverride` stories; README "Theming" explains primitives, roles and components, lists what each role falls back to, and shows an override.
- A test pins that, with `tokens.css` loaded, the card, badge and section heading keep their 0.9 look.

### Changed

- `tokens.css` defines `--dc-dialog-max-width` (480px, the dialog's default), so the token check passes on
  code that reads it; setting it on a `dc-dialog` still overrides it per dialog.
- `desktop-compact-check-tokens` counts a token registered with `@property` as defined, and no longer counts a
  token that appears only inside a stylesheet comment.

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
