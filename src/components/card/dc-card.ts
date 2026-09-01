import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('dc-card')
export class DcCard extends LitElement {
  static styles = css`
    :host {
      display: block;
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
  `

  @property({ type: Boolean, reflect: true })
  interactive = false

  @property({ type: Boolean, reflect: true })
  compact = false

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

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-card': DcCard
  }
}
