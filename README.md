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
themselves have no light/dark awareness.

## Components (v1 — complete, 17/17)

| Component | Description |
|---|---|
| `dc-button` | Button with `primary`/`secondary`/`ghost`/`danger` variants, form-associated (`type="submit"`/`"reset"` participate in the owning `<form>`) |
| `dc-input` | Text/email/password/number/search input, form-associated with native constraint validation |
| `dc-select` | Select control, data-driven `options` property (not slotted `<option>`s — works around a shadow-DOM `<select>` HTML spec gap) |
| `dc-textarea` | Multi-line text input, form-associated |
| `dc-badge` | Small status/count indicator |
| `dc-card` | Content container with consistent padding/border |
| `dc-spinner` | Loading indicator |
| `dc-dialog` | Modal dialog (native `<dialog>` + `showModal()` — focus trap, backdrop, Escape-to-close all come from the platform) |
| `dc-confirm-dialog` | `dc-dialog` + two `dc-button`s composed into a confirm/cancel flow |
| `dc-delete-confirm-button` | Two-state delete trigger: icon-only button swaps to a visible confirm button on click, resets on blur |
| `dc-empty-state` | Empty-state placeholder (icon slot, heading, description, actions slot) |
| `dc-section-heading` | Section heading with consistent typography |
| `dc-tab-bar` | Tab navigation bar |
| `dc-status-strip` | Inline `idle`/`loading`/`error`/`done` status indicator (reuses `dc-spinner` for the loading state) |
| `dc-toast` | Single-toast display primitive — `info`/`success`/`warning`/`error` variants, no built-in stacking/queueing/auto-dismiss (consumer owns that) |
| `dc-paste-rows-zone` | Paste-only target for bulk Excel/Word row import — parses tab-separated clipboard content, dispatches the parsed rows; no built-in feedback banner (compose with `dc-toast` for that) |
| `dc-context-menu` | Right-click context menu — Popover API for open/close (light-dismiss + top-layer stacking from the platform), roving-tabindex keyboard navigation, viewport-edge clamping |

Run `npm run storybook` to browse every component interactively, including variants not shown above.

## Accessibility

Every component ships with an axe accessibility test as part of its test suite (`npm test`). Where a
component composes an icon-only or otherwise unlabelled control, it forwards a consumer-supplied
`aria-label` to the actual interactive element (not just the host) — see `dc-button`, `dc-input`,
`dc-dialog`.

## Development

```bash
npm install
npm test              # @web/test-runner, real Chromium
npm run typecheck
npm run guard          # forge-ignorance scan (this package must stay domain-neutral)
npm run build          # per-component ESM output, type declarations
npm run storybook      # interactive component browser
```

## License

MIT
