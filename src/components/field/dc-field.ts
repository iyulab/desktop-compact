import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * A form field's frame: a visible label above one control, then a hint or an error below it. The
 * control keeps its own accessible name (`aria-label`) — a label in this shadow root cannot point
 * into the control's — so the label here is for the eye, and clicking it focuses the control.
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
      grid-column-end: span var(--dc-field-span);
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
      color: var(--dc-field-hint-color, var(--dc-color-text-muted, #8a8a92));
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
    this.style.setProperty('--dc-field-span', String(this.span || 1))
  }

  #focusControl = () => {
    const control = this.querySelector<HTMLElement>(':scope > *')
    control?.focus()
  }

  render() {
    return html`
      <span class="label" @click=${this.#focusControl}>${this.label}${this.required ? html`<span class="required" aria-hidden="true">*</span>` : nothing}</span>
      <slot></slot>
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
