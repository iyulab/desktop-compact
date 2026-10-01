import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * A form field's frame: a visible label above one control, then a hint or an error below it. The
 * control keeps its own accessible name (`aria-label`) — a label in this shadow root cannot point
 * into the control's — so the label here is for the eye, and clicking it focuses the control. The slotted child must itself
 * be the focusable control (or a host that delegates focus).
 *
 * What a screen reader needs from the field reaches the control itself: the hint or error is its
 * description, an error marks it invalid, and `required` marks it required. A native `input`,
 * `select` or `textarea` gets `aria-description`, `aria-invalid` and `aria-required` (the field
 * owns those three on it); a `dc-input`, `dc-select` or `dc-textarea` gets them through its
 * `fieldAria` and puts them on its native element.
 */
@customElement('dc-field')
export class DcField extends LitElement {
  static styles = css`
    :host {
      display: grid;
      gap: var(--dc-field-gap, var(--dc-space-1, 4px));
      align-content: start;
      min-width: 0;
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    :host([span]:not([span='0'])) {
      grid-column-end: span var(--_field-span);
    }
    .label {
      font-size: var(--dc-field-label-size, var(--dc-font-size-sm, 12px));
      font-weight: var(--dc-field-label-weight, var(--dc-font-weight-medium, 500));
      color: var(--dc-field-label-color, var(--dc-color-text-secondary, #55555c));
      cursor: default;
      user-select: none;
    }
    .required {
      margin-left: 2px;
      color: var(--dc-field-required-color, var(--dc-color-accent-text, #1d4ed8));
    }
    .hint,
    .error {
      margin: 0;
      font-size: var(--dc-font-size-sm, 12px);
    }
    .hint {
      color: var(--dc-field-hint-color, var(--dc-color-text-secondary, #55555c));
    }
    .error {
      color: var(--dc-color-danger-text, var(--dc-color-danger, #dc2626));
    }
  `

  @property() label = ''
  @property() hint = ''
  @property() error = ''
  @property({ type: Boolean, reflect: true }) required = false
  /** Grid columns this field takes inside a grid of fields; 0 leaves it to the grid. */
  @property({ type: Number, reflect: true }) span = 0

  updated() {
    this.style.setProperty('--_field-span', String(this.span || 1))
    this.#describeControl()
  }

  /** Hands the hint or error, invalid and required to the control (see the class description). */
  #describeControl = () => {
    const control = this.querySelector<HTMLElement>(':scope > *')
    if (!control) return
    const aria = { description: this.error || this.hint, invalid: this.error !== '', required: this.required }
    if ('fieldAria' in control) {
      ;(control as HTMLElement & { fieldAria?: typeof aria }).fieldAria = aria
    } else if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) {
      const set = (name: string, value: string) => (value ? control.setAttribute(name, value) : control.removeAttribute(name))
      set('aria-description', aria.description)
      set('aria-invalid', aria.invalid ? 'true' : '')
      set('aria-required', aria.required && !control.required ? 'true' : '')
    } else if (control.localName.includes('-') && !customElements.get(control.localName)) {
      // A control defined later: describe it once it is.
      void customElements.whenDefined(control.localName).then(this.#describeControl)
    }
  }

  #focusControl = () => {
    const control = this.querySelector<HTMLElement>(':scope > *')
    control?.focus()
  }

  render() {
    return html`
      <span class="label" @click=${this.#focusControl}>${this.label}${this.required ? html`<span class="required" aria-hidden="true">*</span>` : nothing}</span>
      <slot @slotchange=${this.#describeControl}></slot>
      <div aria-live="polite">
        ${this.error ? html`<p class="error">${this.error}</p>` : this.hint ? html`<p class="hint">${this.hint}</p>` : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-field': DcField
  }
}
