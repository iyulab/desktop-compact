import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('dc-empty-state')
export class DcEmptyState extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--dc-space-6, 24px);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      color: var(--dc-color-text, #1a1a1e);
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-bottom: var(--dc-space-3, 12px);
      border-radius: var(--dc-radius-lg, 10px);
      background: color-mix(in srgb, var(--dc-color-accent, #2563eb) 12%, transparent);
      font-size: 22px;
    }
    .icon[hidden] {
      display: none;
    }
    h2 {
      margin: 0 0 var(--dc-space-1, 4px);
      font-size: var(--dc-font-size-lg, 15px);
      font-weight: var(--dc-font-weight-semibold, 600);
    }
    p {
      margin: 0 0 var(--dc-space-4, 16px);
      max-width: 320px;
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-color-text-muted, #8a8a92);
    }
  `

  @property()
  heading = ''

  @property()
  description = ''

  @state()
  private hasIcon = false

  #handleIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    this.hasIcon = slot.assignedNodes({ flatten: true }).length > 0
  }

  render() {
    return html`
      <div class="icon" ?hidden=${!this.hasIcon}>
        <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
      </div>
      <h2>${this.heading}</h2>
      ${this.description ? html`<p>${this.description}</p>` : ''}
      <slot name="actions"></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-empty-state': DcEmptyState
  }
}
