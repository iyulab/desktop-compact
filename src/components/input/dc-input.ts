import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { LitElement, type PropertyValues } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search'

@customElement('dc-input')
export class DcInput extends FormAssociatedMixin(LitElement) {
  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }
    input {
      box-sizing: border-box;
      width: 100%;
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border: 1px solid var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-sm, 4px);
      background: var(--dc-color-bg, #ffffff);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-md, 13px);
    }
    input:disabled {
      opacity: var(--dc-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    input:focus-visible {
      outline: var(--dc-focus-ring-width, 2px) solid var(--dc-color-accent, #2563eb);
      outline-offset: 1px;
    }
    :host(:state(invalid)) input {
      border-color: var(--dc-color-danger, #dc2626);
    }
  `

  @property({ reflect: true })
  name = ''

  @property()
  value = ''

  @property({ reflect: true })
  type: InputType = 'text'

  @property()
  placeholder = ''

  @property({ type: Boolean, reflect: true })
  required = false

  @query('input')
  private _inner!: HTMLInputElement

  firstUpdated(): void {
    this.internals.setFormValue(this.value)
    this._syncValidity()
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('value') || changed.has('required') || changed.has('type')) {
      this.internals.setFormValue(this.value)
      this._syncValidity()
    }
  }

  formResetCallback(): void {
    this.value = this.getAttribute('value') ?? ''
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    this.value = typeof state === 'string' ? state : ''
  }

  private _syncValidity(): void {
    if (!this._inner) return
    if (this._inner.validity.valid) {
      this.internals.setValidity({})
      this.internals.states.delete('invalid')
    } else {
      this.internals.setValidity(this._inner.validity, this._inner.validationMessage, this._inner)
      this.internals.states.add('invalid')
    }
  }

  private _handleInput(): void {
    this.value = this._inner.value
  }

  render() {
    return html`
      <input
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        ?required=${this.required}
        @input=${this._handleInput}
        part="input"
      />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-input': DcInput
  }
}
