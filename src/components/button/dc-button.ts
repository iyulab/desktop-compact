import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { LitElement } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonType = 'button' | 'submit' | 'reset'

@customElement('dc-button')
export class DcButton extends FormAssociatedMixin(LitElement) {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--dc-space-2, 8px);
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border-radius: var(--dc-radius-sm, 4px);
      border: 1px solid transparent;
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-md, 13px);
      font-weight: var(--dc-font-weight-medium, 500);
      cursor: pointer;
    }
    button:disabled {
      cursor: not-allowed;
      opacity: var(--dc-opacity-disabled, 0.5);
    }
    button:focus-visible {
      outline: var(--dc-focus-ring-width, 2px) solid var(--dc-color-accent, #2563eb);
      outline-offset: 2px;
    }
    :host([variant='primary']) button {
      background: var(--dc-color-accent, #2563eb);
      color: var(--dc-color-accent-contrast, #ffffff);
    }
    :host([variant='secondary']) button {
      background: var(--dc-color-surface, #f7f7f8);
      color: var(--dc-color-text, #1a1a1e);
      border-color: var(--dc-color-border, #e2e2e4);
    }
    :host([variant='ghost']) button {
      background: transparent;
      color: var(--dc-color-text, #1a1a1e);
    }
    :host([variant='danger']) button {
      background: var(--dc-color-danger, #dc2626);
      color: var(--dc-color-accent-contrast, #ffffff);
    }
  `

  @property({ reflect: true })
  variant: ButtonVariant = 'secondary'

  @property({ reflect: true })
  type: ButtonType = 'button'

  private _handleClick(): void {
    if (this.disabled) return
    if (this.type === 'submit') {
      this.internals.form?.requestSubmit()
    } else if (this.type === 'reset') {
      this.internals.form?.reset()
    }
  }

  render() {
    return html`
      <button type="button" ?disabled=${this.disabled} @click=${this._handleClick} part="button">
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-button': DcButton
  }
}
