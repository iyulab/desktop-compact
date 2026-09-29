import { html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { LitElement, type PropertyValues } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

/**
 * A checkbox with its label in the default slot. The native `<input type="checkbox">` inside keeps
 * the platform's role, Space-key toggle and `indeterminate` rendering; this element adds the
 * design tokens, form association and a `change` event that crosses the shadow boundary.
 */
@customElement('dc-checkbox')
export class DcCheckbox extends FormAssociatedMixin(LitElement) {
  static styles = css`
    :host {
      display: inline-block;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-md, 13px);
      cursor: pointer;
    }
    input {
      width: 14px;
      height: 14px;
      margin: 0;
      accent-color: var(--dc-color-accent, #2563eb);
      cursor: inherit;
    }
    input:focus-visible {
      outline: var(--dc-focus-ring-width, 2px) solid var(--dc-color-accent, #2563eb);
      outline-offset: 2px;
    }
    :host([disabled]) label {
      opacity: var(--dc-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    :host(:state(invalid)) input {
      outline: 1px solid var(--dc-color-danger, #dc2626);
      outline-offset: 1px;
    }
  `

  @property({ reflect: true })
  name = ''

  /** Submitted under `name` while checked, as a native checkbox's `value` is. */
  @property()
  value = 'on'

  @property({ type: Boolean })
  checked = false

  /** Shown as neither checked nor unchecked; cleared when the person toggles it. */
  @property({ type: Boolean })
  indeterminate = false

  @property({ type: Boolean, reflect: true })
  required = false

  @query('input')
  private _inner!: HTMLInputElement

  firstUpdated(): void {
    this._syncForm()
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('checked') || changed.has('value') || changed.has('required')) this._syncForm()
  }

  formResetCallback(): void {
    this.checked = this.hasAttribute('checked')
    this.indeterminate = false
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    this.checked = state !== null
  }

  /** Toggles as a person's click would, like `click()` on a native checkbox. */
  click(): void {
    if (this._inner) this._inner.click()
    else super.click()
  }

  private _syncForm(): void {
    this.internals.setFormValue(this.checked ? this.value : null)
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
    this.checked = this._inner.checked
    this.indeterminate = false
    // The native change event is not composed; without this a consumer outside the shadow root
    // would never see the toggle.
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      <label part="label">
        <input
          type="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-label=${ifDefined(this.ariaLabel ?? undefined)}
          @change=${this._handleChange}
          part="input"
        />
        <slot></slot>
      </label>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-checkbox': DcCheckbox
  }
}
