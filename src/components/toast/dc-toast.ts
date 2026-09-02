import { html, css, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import '../button/dc-button.js'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

const VARIANT_ICON: Record<ToastVariant, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
}

// role differs by urgency, not just variant: info/success are advisory (polite `status`),
// warning/error are time-sensitive enough to interrupt (assertive `alert`) — matches the ARIA
// Authoring Practices distinction between the two live-region roles.
const VARIANT_ROLE: Record<ToastVariant, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  error: 'alert',
}

/**
 * Single-toast display primitive — renders one notification given its props. Stacking, queueing,
 * positioning, and auto-dismiss timing are consumer responsibilities; this component holds no
 * store and does not remove itself from the DOM.
 */
@customElement('dc-toast')
export class DcToast extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    [part='root'] {
      display: flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border-radius: var(--dc-radius-sm, 4px);
      background: var(--dc-color-surface, #f7f7f8);
      border: 1px solid var(--dc-color-border, #e2e2e4);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-md, 13px);
    }
    :host([variant='success']) [part='root'] {
      border-color: var(--dc-color-success, #16a34a);
    }
    :host([variant='warning']) [part='root'] {
      border-color: var(--dc-color-warning, #d97706);
    }
    :host([variant='error']) [part='root'] {
      border-color: var(--dc-color-danger, #dc2626);
    }
    [part='icon'] {
      flex-shrink: 0;
    }
    [part='message'] {
      flex: 1;
    }
  `

  @property({ reflect: true })
  variant: ToastVariant = 'info'

  @property()
  message = ''

  @property({ attribute: 'action-label' })
  actionLabel = ''

  @property({ attribute: 'dismiss-label' })
  dismissLabel = ''

  private _handleAction(): void {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true }))
  }

  private _handleDismiss(): void {
    this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      <div part="root" role=${VARIANT_ROLE[this.variant]}>
        <span part="icon">${VARIANT_ICON[this.variant]}</span>
        <span part="message">${this.message}</span>
        ${this.actionLabel
          ? html`<dc-button part="action" variant="ghost" @click=${this._handleAction}
              >${this.actionLabel}</dc-button
            >`
          : nothing}
        <dc-button
          part="dismiss"
          variant="ghost"
          aria-label=${ifDefined(this.dismissLabel || undefined)}
          @click=${this._handleDismiss}
          >&times;</dc-button
        >
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-toast': DcToast
  }
}
