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

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('role', 'tablist')
  }

  render() {
    return html`
      ${this.items.map(
        (item) => html`
          <button
            role="tab"
            aria-selected=${item.id === this.activeId ? 'true' : 'false'}
            @click=${() => this.#select(item.id)}
          >
            ${item.label}
          </button>
        `
      )}
    `
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
