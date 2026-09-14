import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export interface TabItem {
  id: string
  label: string
}

export class DcTabChangeEvent extends Event {
  constructor(public readonly tabId: string) {
    super('dc-tab-change', { bubbles: true, composed: true })
  }
}

@customElement('dc-tab-bar')
export class DcTabBar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      border-bottom: 1px solid var(--dc-color-border, #e2e2e4);
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    button {
      appearance: none;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      font: inherit;
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-color-text-secondary, #55555c);
      cursor: pointer;
    }
    button[aria-selected='true'] {
      color: var(--dc-color-accent, #2563eb);
      border-bottom-color: var(--dc-color-accent, #2563eb);
      font-weight: var(--dc-font-weight-medium, 500);
    }
    button:focus-visible {
      outline: 2px solid var(--dc-color-accent, #2563eb);
      outline-offset: -2px;
    }
  `

  @property({ type: Array })
  items: TabItem[] = []

  @property({ attribute: 'active-id' })
  activeId = ''

  /**
   * How arrow-key focus relates to selection (WAI-ARIA APG tabs pattern).
   * `automatic`: moving focus selects the tab — fine when a panel shows without
   * noticeable delay. `manual`: arrows only move focus; Enter or Space selects —
   * for panels that are slow to show.
   */
  @property()
  activation: 'automatic' | 'manual' = 'automatic'

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('role', 'tablist')
  }

  render() {
    // Roving tabindex: the tab list is one Tab stop, landing on the selected tab
    // (or the first one when nothing is selected); arrows move within it.
    const selected = this.items.some((item) => item.id === this.activeId)
    return html`
      ${this.items.map(
        (item, index) => html`
          <button
            role="tab"
            aria-selected=${item.id === this.activeId ? 'true' : 'false'}
            tabindex=${item.id === this.activeId || (!selected && index === 0) ? '0' : '-1'}
            @click=${() => this.#select(item.id)}
            @keydown=${(e: KeyboardEvent) => this.#onKeydown(e, index)}
          >
            ${item.label}
          </button>
        `
      )}
    `
  }

  #onKeydown(e: KeyboardEvent, index: number) {
    const last = this.items.length - 1
    let target: number
    switch (e.key) {
      case 'ArrowRight':
        target = index === last ? 0 : index + 1
        break
      case 'ArrowLeft':
        target = index === 0 ? last : index - 1
        break
      case 'Home':
        target = 0
        break
      case 'End':
        target = last
        break
      default:
        return
    }
    e.preventDefault()
    const buttons = this.shadowRoot!.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
    buttons[target]?.focus()
    if (this.activation === 'automatic') this.#select(this.items[target].id)
  }

  #select(id: string) {
    if (id === this.activeId) return
    this.activeId = id
    this.dispatchEvent(new DcTabChangeEvent(id))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-tab-bar': DcTabBar
  }
}
