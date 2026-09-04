import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { LitElement, type PropertyValues } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export type SelectSize = 'sm' | 'md'

@customElement('dc-select')
export class DcSelect extends FormAssociatedMixin(LitElement) {
  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }
    select {
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
    select:disabled {
      opacity: var(--dc-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    select:focus-visible {
      outline: var(--dc-focus-ring-width, 2px) solid var(--dc-color-accent, #2563eb);
      outline-offset: 1px;
    }
    :host(:state(invalid)) select {
      border-color: var(--dc-color-danger, #dc2626);
    }
    :host([size='sm']) select {
      padding: var(--dc-space-1, 4px) var(--dc-space-2, 8px);
      font-size: var(--dc-font-size-sm, 12px);
    }
  `

  @property({ reflect: true })
  name = ''

  @property({ reflect: true })
  size: SelectSize = 'md'

  @property()
  value = ''

  @property({ attribute: false })
  options: SelectOption[] = []

  @property()
  placeholder = ''

  @property({ type: Boolean, reflect: true })
  required = false

  @query('select')
  private _inner!: HTMLSelectElement

  firstUpdated(): void {
    this.internals.setFormValue(this.value)
    this._syncValidity()
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('value') || changed.has('required') || changed.has('options')) {
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

  private _handleChange(): void {
    this.value = this._inner.value
    // The inner <select>'s native `change` is non-bubbling and, even if it
    // were, would stop at this component's own shadow boundary — a consumer
    // outside has no way to observe a value change without this re-dispatch.
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  render() {
    const showPlaceholder = this.placeholder !== ''
    return html`
      <select
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        @change=${this._handleChange}
        part="select"
      >
        ${showPlaceholder
          ? html`<option value="" ?selected=${this.value === ''} disabled hidden>
              ${this.placeholder}
            </option>`
          : null}
        ${this.options.map(
          (opt) => html`
            <option value=${opt.value} ?selected=${opt.value === this.value} ?disabled=${opt.disabled}>
              ${opt.label}
            </option>
          `,
        )}
      </select>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-select': DcSelect
  }
}
