# Changelog

All notable changes to `@iyulab/desktop-compact` are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) (while the version is `0.x`, a minor
release may change the API). Releases up to 0.8.2 are recorded in the git history.

## [Unreleased]

## [0.14.0] - 2026-10-14

### Added

- `u-bridge.css` (`@iyulab/desktop-compact/u-bridge.css`): desktop-compact as the house theme of the `--u-` components
  (`@iyulab/components` and the widgets built on it, such as chat-components). Loaded after the u tokens and
  `tokens.css`, it points the u role tokens — grounds, text, lines, the accent and status fills with their tints,
  radius, elevation, spacing, type — and the neutral scale some u components read directly at the `--dc-` tokens,
  in the `iyu.house` cascade layer: over the u defaults, under the app's own CSS. Light and dark follow
  desktop-compact; the u sheets' own dark palette is not needed.

## [0.13.1] - 2026-10-13

### Fixed

- `dc-input` takes `size="sm"` (26px, `--dc-control-height-sm`), as `dc-select`, `dc-button` and
  `dc-segmented-control` do. It had no size, so in a dense row of `sm` controls an input stood 8px taller than the
  select beside it. `InputSize` is exported with it.

## [0.13.0] - 2026-10-13

### Added

- `--dc-control-height` (34px) and `--dc-control-height-sm` (26px): one height for the one-line controls —
  `dc-input`, `dc-select`, `dc-button` and `dc-segmented-control`, each at its size — so a row of them lines up.
  Before, a select stood 2px taller than a button beside it and a segmented control several pixels shorter.
- `--dc-control-border`: the outline of `dc-input`, `dc-select`, `dc-textarea` and `dc-segmented-control`. Unset,
  it is `--dc-color-border`, as before. A dark theme whose border colour is faint on the control ground sets it so
  the controls keep a visible edge (non-text contrast, WCAG 1.4.11) without darkening every card's border.

### Changed

- `dc-segmented-control` takes the font size of a button of its size (13px, `sm` 12px) as well as its height.
- `dc-field` adds no space under its control while it has no hint or error, so its control's bottom edge is the
  field's: a button beside a field in a row aligned to the end now lines up with the control, not 4px below it.
- `dc-select` shows its placeholder in the muted text colour while no value is chosen, so a required select with
  an empty value no longer reads as if its placeholder were the chosen value.
- `dc-input type="search"` draws its clear button in the secondary text colour (the text colour on hover) instead
  of the system's blue.

## [0.12.1] - 2026-10-08

### Added

- `dc-toast`: an `icon` slot replaces the variant's glyph with the consumer's own mark. The icon is now hidden from assistive technology — it is decorative; the live-region role and the message carry the meaning.

## [0.12.0] - 2026-10-06

### Added

- `--dc-control-bg`: the ground of `dc-input`, `dc-select` and `dc-textarea`. Unset, it is `--dc-color-bg`, as
  before. An app whose page ground is tinted — paper, not white — sets it (to `--dc-color-surface-raised`, say) so
  the controls on its cards do not read as disabled.
- `tableStyles` pinned cells: a `th.pin` / `td.pin` stays at the start while a wide table scrolls across, on a solid
  ground (`--dc-table-pin-bg`, default `--dc-color-surface-raised`); a run of pinned columns gives each its offset
  in `--dc-table-pin-left`. A pinned header cell stays above the pinned body cells.

### Changed

- `tableStyles`: the header row is sticky — it stays in view while the rows scroll in whatever box scrolls the
  table — and the rule under it is drawn as an inset shadow so it moves with the header (a collapsed border stays
  behind with the rows). A table that scrolls with its page is unchanged until its box bounds its height.

- Development: `tsc` (and `npm run typecheck`) is TypeScript 7, installed as `@typescript/native`; `typescript`
  resolves to `@typescript/typescript6`, whose compiler API the declaration build reads. The published files are
  unchanged.

## [0.11.1] - 2026-10-02

### Fixed

- `dc-select` shows a `value` set from outside after the selection was changed once — by a person picking an option, or by
  setting the select's value. Before, it kept showing the earlier choice (or the first option) while `value` held the new one,
  since an option's `selected` attribute stops deciding the selection once it has been changed.

## [0.11.0] - 2026-10-02

### Added

- `--dc-callout-size` role token: the text size of `dc-callout` (falls back to `--dc-font-size-sm`, as before).
- `fieldAria` on `dc-input`, `dc-select` and `dc-textarea` (a `FieldAria`: description, invalid, required), put on
  their native element as `aria-description`, `aria-invalid` and `aria-required`. `FieldAria` is exported.

### Changed

- `--dc-color-text-muted` is darker in the light palette (`#686870`) and lighter in the dark one (`#9a9aa3`): small muted text
  — an empty state's or a section's description, a table's secondary cells, a menu's shortcut — now reads at 4.5:1 or more
  on the page ground, a surface and a hovered surface (it read 2.9–3.4:1 in light). Component fallbacks follow.

### Fixed

- `dc-field` now tells assistive technology what it shows: its hint, or its error, becomes the control's description, an
  error marks the control invalid, and `required` marks it required. Before, the hint and error were only announced as
  they changed, never when the control was focused, and `required` was a mark for the eye only. A native control gets
  the three `aria-*` attributes; a `dc-input`, `dc-select` or `dc-textarea` gets them through `fieldAria`.

## [0.10.1] - 2026-10-02

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
