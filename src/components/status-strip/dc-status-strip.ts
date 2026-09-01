import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../spinner/dc-spinner.js'

export type StatusStripState = 'idle' | 'loading' | 'error' | 'done'

@customElement('dc-status-strip')
export class DcStatusStrip extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    [role='status'] {
      display: inline-flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-color-text-secondary, #55555c);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: var(--dc-radius-full, 9999px);
      background: var(--dc-color-text-muted, #8a8a92);
    }
    :host([status='error']) .dot {
      background: var(--dc-color-danger, #dc2626);
    }
    :host([status='done']) .dot {
      background: var(--dc-color-success, #16a34a);
    }
  `

  @property({ reflect: true })
  status: StatusStripState = 'idle'

  @property()
  label = ''

  render() {
    return html`
      <span role="status">
        ${this.status === 'loading'
          ? html`<dc-spinner part="spinner"></dc-spinner>`
          : html`<span class="dot" part="dot"></span>`}
        ${this.label ? html`<span part="label">${this.label}</span>` : null}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-status-strip': DcStatusStrip
  }
}
