# desktop-compact

Desktop-only, compact-density UI primitives for Electron/Tauri apps. Framework-neutral custom
elements ([Lit](https://lit.dev)), zero built-in strings (every user-facing label is
consumer-supplied), Shadow DOM + CSS custom-property tokens for theming.

Not a general-purpose or mobile-density kit — it targets the density and interaction patterns of
desktop utility software specifically. Layout/structure (sidebars, docking panels, toolbars) belongs
in [`desktop-patterns`](https://github.com/iyulab/desktop-patterns); native platform integration
(file dialogs, tray, window control) belongs in
[`electron-kit`](https://github.com/iyulab/electron-kit). This package knows about neither, and
knows nothing about any specific consuming application — it is the lowest layer, with no dependencies
of its own.

## Install

Requires Node ≥22.

```bash
npm install @iyulab/desktop-compact
```

Import only the components you use — each ships as its own subpath for tree-shaking:

```ts
import '@iyulab/desktop-compact/button'
import '@iyulab/desktop-compact/dialog'
```

Or import everything via the barrel:

```ts
import '@iyulab/desktop-compact'
```

## Usage

```html
<dc-button variant="primary">Save</dc-button>

<dc-confirm-dialog
  id="confirm"
  heading="Delete item?"
  confirm-label="Delete"
  cancel-label="Cancel"
  danger
>
  This action cannot be undone.
</dc-confirm-dialog>
```

```ts
document.querySelector('dc-confirm-dialog')!.addEventListener('confirm', () => {
  // consumer handles the confirmed action
})
```

Every component takes its user-facing text as a plain attribute/property or slot — there is no
built-in i18n layer, and no component assumes a language. See each component's Storybook story
(`npm run storybook`) for its full API.

## Theming

Import `tokens.css` once in your app's global stylesheet for consistent theming across every
component:

```ts
import '@iyulab/desktop-compact/tokens.css'
```

Every component also ships with sane fallback values, so it still renders correctly even without the
stylesheet — `tokens.css` is for consistent cross-component theming and dark-mode support, not a hard
dependency. Override any `--dc-*` custom property to theme; light/dark is handled by switching token
values (via your app's own `data-theme` attribute or a `prefers-color-scheme` media query) — components
themselves have no light/dark awareness. `tokens.css` also sets `color-scheme` to match the palette in
use, so what the browser draws itself — scrollbars, native form controls — is light or dark with it.

Colour tokens come in two forms. `--dc-color-accent`, `-success`, `-warning` and `-danger` are fills:
borders, solid buttons, the tint behind a badge. Their text forms — `--dc-color-accent-text`,
`-success-text`, `-warning-text`, `-danger-text` — are what a label is painted with: an outline
button's label, a tinted badge's label, a danger menu item. A fill that reads well as a border is
often under 4.5:1 as small text, so a theme that overrides a fill should override its text form too.
A component falls back to the fill when the text form is not set.

### Three layers: primitives, roles, components

Tokens come in three layers:

1. **Primitives** — the base palette, spacing, type and elevation: `--dc-color-surface`, `--dc-color-accent`,
   `--dc-space-*`, `--dc-font-size-*`, `--dc-elevation-*`. `tokens.css` gives these values.
2. **Roles** — what a part of the interface is made of: `--dc-card-bg`, `--dc-table-header-bg`,
   `--dc-color-accent-subtle`. Components read roles.
3. **Components** — each reads its role tokens, falls back to a primitive, then to a literal:
   `var(--dc-card-bg, var(--dc-color-surface, #f7f7f8))`.

Roles are **declared, not given a value**: `tokens.css` registers them with `@property` and sets none. A role
that is not set therefore falls back to the primitive where the component sits, so overriding a primitive on
the root *or on any subtree* (a panel with its own `--dc-color-surface` or `--dc-color-accent`) reaches every
component inside it. To theme a role, set it — usually on `:root`, or on a wrapping element to scope it. The
defaults reproduce the 0.9 look; a test keeps it that way.

| Role | Falls back to |
| --- | --- |
| `--dc-color-rule` | `--dc-color-border` (hairline rules) |
| `--dc-color-accent-subtle`, `-secondary-subtle`, `-success-subtle`, `-warning-subtle`, `-danger-subtle` | 15% tint of the fill |
| `--dc-page-eyebrow-color`, `-size` | `--dc-color-accent-text`, `--dc-font-size-xs` |
| `--dc-page-title-size`, `-weight` | `--dc-font-size-2xl`, `--dc-font-weight-bold` |
| `--dc-page-description-color` | `--dc-color-text-secondary` |
| `--dc-page-rule` | `--dc-color-rule` |
| `--dc-section-title-weight` | `--dc-font-weight-semibold` |
| `--dc-section-description-color` | `--dc-color-text-muted` |
| `--dc-section-marker-color` | `--dc-color-accent` |
| `--dc-callout-size` | `--dc-font-size-sm` |
| `--dc-card-bg` | `--dc-color-surface` |
| `--dc-card-border` | `1px solid` `--dc-color-border` |
| `--dc-card-elevation` | `none` |
| `--dc-card-radius` | `--dc-radius-md` |
| `--dc-card-header-size`, `-accent` | `--dc-font-size-md`, `--dc-color-secondary-text` |
| `--dc-card-footer-bg` | `--dc-color-surface` |
| `--dc-field-label-size`, `-weight`, `-color` | `--dc-font-size-sm`, `--dc-font-weight-medium`, `--dc-color-text-secondary` |
| `--dc-field-hint-color` | `--dc-color-text-secondary` |
| `--dc-field-required-color` | `--dc-color-accent-text` |
| `--dc-field-gap` | `--dc-space-1` |
| `--dc-metric-size` | `--dc-font-size-display` |
| `--dc-metric-accent-1`, `-accent-2` | `--dc-color-accent`, `--dc-color-secondary` |
| `--dc-indicator-color` | `--dc-color-accent` |
| `--dc-selection-bg` | `transparent` |
| `--dc-table-header-bg`, `-header-color` | `--dc-color-surface`, `--dc-color-text` |
| `--dc-table-rule` | `--dc-color-rule` |
| `--dc-table-total-rule` | `--dc-color-text` |

```css
:root {
  --dc-card-border: none;
  --dc-card-elevation: var(--dc-elevation-1);
  --dc-selection-bg: color-mix(in srgb, var(--dc-color-accent) 10%, transparent);
}
```

The Storybook story `Foundations/Hierarchy` shows the parts together, and `BrandOverride` the same screen
with roles overridden on a wrapping element.

### Checking token references

A `var(--dc-…, fallback)` whose token no stylesheet defines falls back silently — often to a light
default that only looks wrong in the dark scheme. The package ships a command that fails when your
code reads a `--dc-*` token nothing defines:

```bash
desktop-compact-check-tokens [--defined <css>]... <dir|file>...
```

A token registered with `@property` (the role tokens) counts as defined. This package's `tokens.css` always counts as defined; each `--defined` adds another stylesheet (your
app's own, or another design-token package's). Directories are scanned recursively for `.ts`, `.js`,
`.mjs` and `.css` files, skipping `node_modules` and dot-directories. Every undefined token is printed
as `--dc-x in <path>` and the command exits 1; otherwise it prints `[tokens] ok — N defined` and exits 0.
Run it from your test script, for example:

```json
"scripts": { "check:tokens": "desktop-compact-check-tokens --defined src/styles.css src" }
```

## Components (v1 — complete, 17/17)

| Component | Description |
|---|---|
| `dc-button` | Button with `primary`/`secondary`/`ghost`/`danger`/`outline` variants and `sm`/`md` sizes, form-associated (`type="submit"`/`"reset"` participate in the owning `<form>`; the first `type="submit"` also submits it on Enter in a text field, as a native default button would) |
| `dc-input` | Text/email/password/number/search input, form-associated with native constraint validation |
| `dc-select` | Select control, data-driven `options` property (not slotted `<option>`s — works around a shadow-DOM `<select>` HTML spec gap); an option's optional `group` renders consecutive options under one `<optgroup label>` |
| `dc-checkbox` | Checkbox with its label slotted — wraps the native checkbox (role, Space key, `indeterminate` from the platform), form-associated (submits `value` under `name` while checked, `required` validation), `change` on user toggle only |
| `dc-textarea` | Multi-line text input, form-associated |
| `dc-badge` | Small status/count indicator |
| `dc-card` | Content container with consistent padding/border |
| `dc-spinner` | Loading indicator |
| `dc-dialog` | Modal dialog (native `<dialog>` + `showModal()` — focus trap, backdrop, Escape-to-close all come from the platform) |
| `dc-confirm-dialog` | `dc-dialog` + two `dc-button`s composed into a confirm/cancel flow |
| `dc-delete-confirm-button` | Two-state delete trigger: icon-only button swaps to a visible confirm button on click, resets on blur |
| `dc-empty-state` | Empty-state placeholder (icon slot, heading, description, actions slot) |
| `dc-section-heading` | Section heading with consistent typography |
| `dc-field` | Label, required mark, hint and error around one control |
| `dc-tab-bar` | Tab list (`role="tablist"`/`"tab"` + `aria-selected`) — roving-tabindex keyboard navigation (Arrow keys wrap, Home/End); `activation="manual"` for panels slow to show |
| `dc-segmented-control` | One value out of a few, all visible (`role="radiogroup"`/`"radio"` + `aria-checked`) — single Tab stop, arrow keys move and select (skipping disabled), form-associated, `change` on user pick only |
| `dc-status-strip` | Inline `idle`/`loading`/`error`/`done` status indicator (reuses `dc-spinner` for the loading state) |
| `dc-toast` | Single-toast display primitive — `info`/`success`/`warning`/`error` variants, no built-in stacking/queueing/auto-dismiss (consumer owns that) |
| `dc-paste-rows-zone` | Paste-only target for bulk Excel/Word row import — parses tab-separated clipboard content, dispatches the parsed rows; no built-in feedback banner (compose with `dc-toast` for that) |
| `dc-data-table` | Read-only table of records whose rows open something — sticky header, row header holding a button for keyboard activation, a click anywhere on a row activates it (a click that ends a text selection does not), cells keep their line breaks, optional empty label; dispatches `activate` with the row id |
| `dc-context-menu` | Right-click context menu — Popover API for open/close (light-dismiss + top-layer stacking from the platform), roving-tabindex keyboard navigation, viewport-edge clamping |

Run `npm run storybook` to browse every component interactively, including variants not shown above.

## Accessibility

Every component ships with an axe accessibility test as part of its test suite (`npm test`). Where a
component composes an icon-only or otherwise unlabelled control, it forwards a consumer-supplied
`aria-label` to the actual interactive element (not just the host) — see `dc-button`, `dc-input`,
`dc-dialog`. `dc-button` also forwards the states a button announces — `aria-haspopup` and
`aria-expanded` for a menu or popup trigger, `aria-pressed` for a toggle — and follows their changes,
so set them on the host as you would on a native button. A pressed toggle (`aria-pressed="true"`) is
also painted pressed — the accent fill `dc-segmented-control` uses for its checked segment — in every variant.

## Development

```bash
npm install
npm test              # @web/test-runner, real Chromium
npm run typecheck
npm run guard          # forge-ignorance scan (this package must stay domain-neutral)
npm run guard:test     # node tests for the scripts and the check-tokens command
npm run build          # per-component ESM output, type declarations
npm run storybook      # interactive component browser
```

## License

MIT
