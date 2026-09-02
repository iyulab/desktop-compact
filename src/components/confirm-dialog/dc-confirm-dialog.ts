import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import '../dialog/dc-dialog.js'
import '../button/dc-button.js'

@customElement('dc-confirm-dialog')
export class DcConfirmDialog extends LitElement {
  static styles = css`
    [part='heading'] {
      margin: 0 0 var(--dc-space-3, 12px) 0;
      font-size: var(--dc-font-size-lg, 15px);
      font-weight: var(--dc-font-weight-semibold, 600);
      color: var(--dc-color-text, #1a1a1e);
    }
    [part='body'] {
      margin: 0 0 var(--dc-space-4, 16px) 0;
      color: var(--dc-color-text-secondary, #55555c);
    }
    [part='actions'] {
      display: flex;
      justify-content: flex-end;
      gap: var(--dc-space-2, 8px);
    }
  `

  @property({ type: Boolean, reflect: true })
  open = false

  @property()
  heading = ''

  @property({ attribute: 'confirm-label' })
  confirmLabel = ''

  @property({ attribute: 'cancel-label' })
  cancelLabel = ''

  @property({ type: Boolean, reflect: true })
  danger = false

  private _handleConfirm(): void {
    this.open = false
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }))
  }

  private _handleCancel(): void {
    this.open = false
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      <dc-dialog
        .open=${this.open}
        aria-label=${ifDefined(this.heading || undefined)}
        @close=${this._handleCancel}
      >
        ${this.heading ? html`<h2 part="heading">${this.heading}</h2>` : null}
        <div part="body"><slot></slot></div>
        <div part="actions">
          <dc-button variant="secondary" @click=${this._handleCancel}>${this.cancelLabel}</dc-button>
          <dc-button variant=${this.danger ? 'danger' : 'primary'} @click=${this._handleConfirm}>
            ${this.confirmLabel}
          </dc-button>
        </div>
      </dc-dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-confirm-dialog': DcConfirmDialog
  }
}
