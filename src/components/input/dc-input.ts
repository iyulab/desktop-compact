import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { LitElement, type PropertyValues } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'date' | 'time' | 'datetime-local'
export type InputSize = 'sm' | 'md'

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
      height: var(--dc-control-height, 34px);
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border: 1px solid var(--dc-control-border, var(--dc-color-border, #e2e2e4));
      border-radius: var(--dc-radius-sm, 4px);
      background: var(--dc-control-bg, var(--dc-color-bg, #ffffff));
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-md, 13px);
    }
    /* The search field's clear button in the control's own colours, not the system's blue. */
    input[type='search']::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      margin-inline-start: var(--dc-space-1, 4px);
      background-color: var(--dc-color-text-secondary, #55555c);
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4l8 8M12 4l-8 8' stroke='black' stroke-width='1.75' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4l8 8M12 4l-8 8' stroke='black' stroke-width='1.75' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
      cursor: pointer;
    }
    input[type='search']::-webkit-search-cancel-button:hover {
      background-color: var(--dc-color-text, #1a1a1e);
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
    :host([size='sm']) input {
      height: var(--dc-control-height-sm, 26px);
      padding: var(--dc-space-1, 4px) var(--dc-space-2, 8px);
      font-size: var(--dc-font-size-sm, 12px);
    }
  `

  @property({ reflect: true })
  name = ''

  @property()
  value = ''

  @property({ reflect: true })
  type: InputType = 'text'

  /** `sm` for a dense row — a toolbar or a filter bar — at the height of a `sm` select or button. */
  @property({ reflect: true })
  size: InputSize = 'md'

  @property()
  placeholder = ''

  @property({ type: Boolean, reflect: true })
  required = false

  /** Forwarded to the native `min` attribute — meaningful for `number` and the date/time types. */
  @property()
  min?: string

  /** Forwarded to the native `max` attribute — meaningful for `number` and the date/time types. */
  @property()
  max?: string

  @query('input')
  private _inner!: HTMLInputElement

  firstUpdated(): void {
    this.internals.setFormValue(this.value)
    this._syncValidity()
  }

  protected updated(changed: PropertyValues<this>): void {
    if (
      changed.has('value') ||
      changed.has('required') ||
      changed.has('type') ||
      changed.has('min') ||
      changed.has('max')
    ) {
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
        min=${ifDefined(this.min)}
        max=${ifDefined(this.max)}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        aria-description=${ifDefined(this.fieldAria?.description || undefined)}
        aria-invalid=${ifDefined(this.fieldAria?.invalid ? 'true' : undefined)}
        aria-required=${ifDefined(this.fieldAria?.required && !this.required ? 'true' : undefined)}
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
