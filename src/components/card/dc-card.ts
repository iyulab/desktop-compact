import { LitElement, html, css, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('dc-card')
export class DcCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      background: var(--dc-card-bg, var(--dc-color-surface, #f7f7f8));
      border: var(--dc-card-border, 1px solid var(--dc-color-border, #e2e2e4));
      border-radius: var(--dc-card-radius, var(--dc-radius-md, 6px));
      box-shadow: var(--dc-card-elevation, none);
      padding: var(--dc-space-4, 16px);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    :host([compact]) {
      padding: var(--dc-space-2, 8px);
    }
    /* With a header or footer the parts carry the padding, so their rules run edge to edge. */
    :host([has-header]),
    :host([has-footer]) {
      padding: 0;
      overflow: hidden;
    }
    .header,
    .footer {
      display: none;
    }
    :host([has-header]) .header {
      display: flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      padding: var(--dc-space-3, 12px) var(--dc-space-4, 16px);
      border-bottom: 1px solid var(--dc-color-rule, var(--dc-color-border, #e2e2e4));
      font-size: var(--dc-card-header-size, var(--dc-font-size-md, 13px));
      font-weight: var(--dc-font-weight-semibold, 600);
    }
    /* A heading slotted as the header (an h2 for the page outline) takes the header's size and
       weight, not the browser's heading defaults. */
    ::slotted([slot='header']) {
      display: contents;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      margin: 0;
    }
    :host([has-header]) .body,
    :host([has-footer]) .body {
      padding: var(--dc-space-4, 16px);
    }
    :host([compact][has-header]) .body,
    :host([compact][has-footer]) .body {
      padding: var(--dc-space-2, 8px);
    }
    :host([has-footer]) .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      padding: var(--dc-space-3, 12px) var(--dc-space-4, 16px);
      border-top: 1px solid var(--dc-color-rule, var(--dc-color-border, #e2e2e4));
      background: var(--dc-card-footer-bg, var(--dc-color-surface, #f7f7f8));
    }
    :host([interactive]) {
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    :host([interactive]:hover) {
      border-color: var(--dc-color-accent, #2563eb);
    }
    :host([interactive]:focus-visible) {
      outline: 2px solid var(--dc-color-accent, #2563eb);
      outline-offset: 2px;
    }
    :host(:has(.dc-card-activator)) {
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    :host(:has(.dc-card-activator:hover)) {
      border-color: var(--dc-color-accent, #2563eb);
    }
    .dc-card-activator {
      all: unset;
      position: absolute;
      inset: 0;
      border-radius: inherit;
      cursor: pointer;
    }
    .dc-card-activator:focus-visible {
      outline: 2px solid var(--dc-color-accent, #2563eb);
      outline-offset: 2px;
    }
  `

  @property({ type: Boolean, reflect: true })
  interactive = false

  @property({ type: Boolean, reflect: true })
  compact = false

  /**
   * Renders an internal, shadow-scoped activator `<button>` spanning the
   * whole card as its sole interactive control, instead of making the host
   * itself `role="button"`. Use this — never `interactive` — when the card
   * also slots real interactive content (e.g. a delete button): a
   * `role="button"` host containing a nested real control is an
   * accessibility violation (axe `nested-interactive` — screen readers
   * cannot reliably drill into a control nested inside another control).
   * Slotted content that must stay independently clickable needs its own
   * `position: relative` + a higher stacking order than this button's
   * default paint layer (e.g. `position: relative; z-index: 1`), the same
   * "stretched link" convention documented for this pattern generally.
   * Mutually exclusive with `interactive` — do not set both.
   */
  @property({ attribute: 'activator-label' })
  activatorLabel?: string

  @state() private hasHeader = false
  @state() private hasFooter = false

  updated() {
    this.toggleAttribute('has-header', this.hasHeader)
    this.toggleAttribute('has-footer', this.hasFooter)
  }

  #slotChanged = (e: Event) => {
    const slot = e.target as HTMLSlotElement
    const filled = slot
      .assignedNodes({ flatten: true })
      .some((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent?.trim())
    if (slot.name === 'header') this.hasHeader = filled
    else this.hasFooter = filled
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.interactive) {
      this.tabIndex = 0
      this.setAttribute('role', 'button')
      this.addEventListener('keydown', this.#handleKeydown)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.#handleKeydown)
  }

  #handleKeydown = (e: KeyboardEvent) => {
    if (!this.interactive) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.dispatchEvent(new Event('dc-activate', { bubbles: true, composed: true }))
    }
  }

  #handleActivatorClick = (e: MouseEvent) => {
    e.stopPropagation()
    this.dispatchEvent(new Event('dc-activate', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      ${this.activatorLabel
        ? html`<button
            type="button"
            class="dc-card-activator"
            aria-label=${this.activatorLabel}
            @click=${this.#handleActivatorClick}
          ></button>`
        : nothing}
      <div class="header" part="header"><slot name="header" @slotchange=${this.#slotChanged}></slot></div>
      <div class="body" part="body"><slot></slot></div>
      <div class="footer" part="footer"><slot name="footer" @slotchange=${this.#slotChanged}></slot></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-card': DcCard
  }
}
