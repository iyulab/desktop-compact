import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('dc-card')
export class DcCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      background: var(--dc-color-surface, #f7f7f8);
      border: 1px solid var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-md, 6px);
      padding: var(--dc-space-4, 16px);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    :host([compact]) {
      padding: var(--dc-space-2, 8px);
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
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-card': DcCard
  }
}
