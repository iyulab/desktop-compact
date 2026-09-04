import { html, css, LitElement, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

export interface ContextMenuItem {
  value?: string
  label?: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

/**
 * Uses the Popover API (`popover="auto"`) for open/close: outside-click and Escape dismissal, and
 * top-layer stacking, come from the platform rather than a hand-rolled document listener. Item-level
 * keyboard navigation (roving tabindex) is this component's own responsibility - the API only
 * governs open/close, not in-menu interaction.
 */
@customElement('dc-context-menu')
export class DcContextMenu extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      margin: 0;
      padding: 0;
      border: none;
      inset: auto;
    }
    [part='menu'] {
      position: fixed;
      display: flex;
      flex-direction: column;
      min-width: 180px;
      padding: var(--dc-space-1, 4px) 0;
      border: 1px solid var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-sm, 4px);
      background: var(--dc-color-bg, #ffffff);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    [part='separator'] {
      height: 1px;
      margin: var(--dc-space-1, 4px) 0;
      background: var(--dc-color-border, #e2e2e4);
    }
    [part='item'] {
      display: flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      width: 100%;
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border: none;
      background: none;
      color: var(--dc-color-text, #1a1a1e);
      font-family: inherit;
      font-size: var(--dc-font-size-sm, 12px);
      text-align: left;
      cursor: pointer;
    }
    [part='item']:hover:not(:disabled),
    [part='item']:focus-visible {
      background: var(--dc-color-surface-hover, #f0f0f1);
      outline: none;
    }
    [part='item']:disabled {
      color: var(--dc-color-text-muted, #8a8a92);
      cursor: not-allowed;
    }
    [part='item'][data-danger]:not(:disabled) {
      color: var(--dc-color-danger, #dc2626);
    }
    [part='icon'] {
      width: 16px;
      text-align: center;
      flex-shrink: 0;
    }
  `

  @property({ type: Array })
  items: ContextMenuItem[] = []

  @property({ type: Boolean, reflect: true })
  open = false

  @property({ type: Number })
  x = 0

  @property({ type: Number })
  y = 0

  @state()
  private _focusIndex = 0

  constructor() {
    super()
    this.addEventListener('toggle', this._handleToggle as EventListener)
  }

  connectedCallback(): void {
    super.connectedCallback()
    // A custom element must not carry attributes before it is inserted (Custom
    // Elements spec: "the result must not have attributes") - Chrome/Firefox/Safari
    // all enforce this and throw on `document.createElement()` (the exact path React
    // uses) if a constructor sets one. `popover`/`role` are static for this component,
    // so connectedCallback is the correct place (this repo's own dc-card follows the
    // same pattern for its own role attribute).
    this.setAttribute('popover', 'auto')
    this.setAttribute('role', 'menu')
  }

  // Syncs `open` back to false when the popover is dismissed by the platform itself (Escape or an
  // outside click via popover="auto" light-dismiss) rather than by this component's own
  // _selectIndex - that path only sets `open` directly and never reaches showPopover/hidePopover,
  // so without this the host's `open` property would desync from the actual :popover-open state.
  private _handleToggle = (e: Event): void => {
    const toggleEvent = e as ToggleEvent
    if (toggleEvent.newState === 'closed' && this.open) {
      this.open = false
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
    }
  }

  private get _enabledIndexes(): number[] {
    return this.items.map((it, i) => (it.separator || it.disabled ? -1 : i)).filter((i) => i >= 0)
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('open')) {
      if (this.open) {
        this._focusIndex = this._enabledIndexes[0] ?? 0
        if (!this.matches(':popover-open')) this.showPopover()
        this._clampToViewportAndFocus()
      } else if (this.matches(':popover-open')) {
        this.hidePopover()
      }
    }
    if (changed.has('_focusIndex') || changed.has('open')) {
      this._focusCurrentItem()
    }
  }

  private _clampToViewportAndFocus(): void {
    requestAnimationFrame(() => {
      const menu = this.shadowRoot?.querySelector<HTMLElement>('[part="menu"]')
      if (!menu) return
      const rect = menu.getBoundingClientRect()
      let left = this.x
      let top = this.y
      if (left + rect.width > window.innerWidth) left = Math.max(0, window.innerWidth - rect.width)
      if (top + rect.height > window.innerHeight) top = Math.max(0, window.innerHeight - rect.height)
      menu.style.left = `${left}px`
      menu.style.top = `${top}px`
      this._focusCurrentItem()
    })
  }

  private _focusCurrentItem(): void {
    // `_focusIndex` indexes into `this.items` (separators included as gaps), not into the rendered
    // [role="menuitem"] NodeList (separators excluded, so its indices are compressed differently) -
    // look up by data-index, which carries the same full-array index `_focusIndex` uses.
    this.shadowRoot
      ?.querySelector<HTMLButtonElement>(`[role="menuitem"][data-index="${this._focusIndex}"]`)
      ?.focus()
  }

  private _selectIndex(i: number): void {
    const item = this.items[i]
    if (!item || item.separator || item.disabled) return
    this.open = false
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
    this.dispatchEvent(
      new CustomEvent('select', { detail: { item, index: i }, bubbles: true, composed: true }),
    )
  }

  private _handleKeydown(e: KeyboardEvent): void {
    const enabled = this._enabledIndexes
    if (enabled.length === 0) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const dir = e.key === 'ArrowDown' ? 1 : -1
      const pos = enabled.indexOf(this._focusIndex)
      this._focusIndex = enabled[(pos + dir + enabled.length) % enabled.length]
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._selectIndex(this._focusIndex)
    }
  }

  render() {
    return html`
      <div part="menu" style="left:${this.x}px; top:${this.y}px;" @keydown=${this._handleKeydown}>
        ${this.items.map((item, i) =>
          item.separator
            ? html`<div part="separator" role="separator"></div>`
            : html`
                <button
                  part="item"
                  role="menuitem"
                  data-index=${i}
                  tabindex=${i === this._focusIndex ? 0 : -1}
                  ?disabled=${item.disabled}
                  ?data-danger=${item.danger}
                  @click=${() => this._selectIndex(i)}
                  @mouseenter=${() => (this._focusIndex = i)}
                >
                  ${item.icon ? html`<span part="icon">${item.icon}</span>` : nothing}
                  <span part="label">${item.label}</span>
                </button>
              `,
        )}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-context-menu': DcContextMenu
  }
}
