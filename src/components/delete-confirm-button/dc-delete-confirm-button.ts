import { html, css, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import '../button/dc-button.js'

const BLUR_RESET_DELAY_MS = 200

/**
 * Two-state delete trigger: an icon-only button that, on click, swaps to a visible
 * consumer-labelled confirm button. Losing focus resets to the idle state after a short delay
 * (prevents an accidental click from landing on the confirm button right after the swap).
 */
@customElement('dc-delete-confirm-button')
export class DcDeleteConfirmButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
  `

  @property({ attribute: 'trigger-label' })
  triggerLabel = ''

  @property({ attribute: 'confirm-label' })
  confirmLabel = ''

  @state()
  confirming = false

  private _resetTimer?: ReturnType<typeof setTimeout>

  private _handleTriggerClick(): void {
    this.confirming = true
  }

  private _handleConfirmClick(): void {
    this.confirming = false
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }))
  }

  private _handleBlur(): void {
    this._resetTimer = setTimeout(() => {
      this.confirming = false
    }, BLUR_RESET_DELAY_MS)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    clearTimeout(this._resetTimer)
  }

  render() {
    return this.confirming
      ? html`
          <dc-button
            variant="danger"
            @click=${this._handleConfirmClick}
            @focusout=${this._handleBlur}
            >${this.confirmLabel}</dc-button
          >
        `
      : html`
          <dc-button
            variant="ghost"
            aria-label=${ifDefined(this.triggerLabel || undefined)}
            @click=${this._handleTriggerClick}
            >&times;</dc-button
          >
        `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-delete-confirm-button': DcDeleteConfirmButton
  }
}
