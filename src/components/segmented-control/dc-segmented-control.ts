import { html, css, LitElement, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export interface SegmentedOption {
  value: string
  label: string
  disabled?: boolean
}

export type SegmentedSize = 'sm' | 'md'

/**
 * A row of mutually exclusive segments — one value out of a few, all visible at
 * once (a view mode, a unit, a filter). Semantics follow the WAI-ARIA radio
 * group pattern: the host is `role="radiogroup"` (name it with `aria-label`),
 * each segment is `role="radio"` with `aria-checked`, the group is a single Tab
 * stop, and the arrow keys move to and select the next enabled segment.
 *
 * Form-associated: submits `value` under `name`. Dispatches a bubbling,
 * composed `change` event when the user picks a segment (not when `value` is
 * set programmatically).
 */
@customElement('dc-segmented-control')
export class DcSegmentedControl extends FormAssociatedMixin(LitElement) {
  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    .group {
      display: inline-flex;
      border: 1px solid var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-sm, 4px);
      overflow: hidden;
    }
    button {
      appearance: none;
      margin: 0;
      border: none;
      border-inline-start: 1px solid var(--dc-color-border, #e2e2e4);
      background: var(--dc-color-surface, #ffffff);
      color: var(--dc-color-text-secondary, #55555c);
      font: inherit;
      font-size: var(--dc-font-size-sm, 12px);
      padding: var(--dc-space-1, 4px) var(--dc-space-3, 12px);
      cursor: pointer;
      white-space: nowrap;
    }
    button:first-child {
      border-inline-start: none;
    }
    button:hover:not([aria-checked='true']):not(:disabled) {
      background: var(--dc-color-surface-hover, #f4f4f5);
      color: var(--dc-color-text, #1a1a1e);
    }
    button[aria-checked='true'] {
      background: var(--dc-color-accent, #2563eb);
      color: var(--dc-color-accent-contrast, #ffffff);
      font-weight: var(--dc-font-weight-medium, 500);
    }
    button:disabled {
      opacity: var(--dc-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    button:focus-visible {
      outline: var(--dc-focus-ring-width, 2px) solid var(--dc-color-accent, #2563eb);
      outline-offset: -2px;
    }
    :host([size='sm']) button {
      padding: 2px var(--dc-space-2, 8px);
      font-size: var(--dc-font-size-xs, 11px);
    }
  `

  @property({ reflect: true })
  name = ''

  @property({ reflect: true })
  size: SegmentedSize = 'md'

  @property()
  value = ''

  @property({ attribute: false })
  options: SegmentedOption[] = []

  connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'radiogroup')
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('value')) this.internals.setFormValue(this.value)
    if (changed.has('disabled')) {
      if (this.disabled) this.setAttribute('aria-disabled', 'true')
      else this.removeAttribute('aria-disabled')
    }
  }

  formResetCallback(): void {
    this.value = this.getAttribute('value') ?? ''
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    this.value = typeof state === 'string' ? state : ''
  }

  #enabled(option: SegmentedOption): boolean {
    return !this.disabled && !option.disabled
  }

  /** The segment that owns the group's single Tab stop. */
  #tabStopIndex(): number {
    const checked = this.options.findIndex((o) => o.value === this.value && this.#enabled(o))
    return checked !== -1 ? checked : this.options.findIndex((o) => this.#enabled(o))
  }

  render() {
    const tabStop = this.#tabStopIndex()
    return html`
      <div class="group" part="group">
        ${this.options.map(
          (option, index) => html`
            <button
              type="button"
              role="radio"
              part="segment"
              aria-checked=${option.value === this.value ? 'true' : 'false'}
              tabindex=${index === tabStop ? '0' : '-1'}
              ?disabled=${!this.#enabled(option)}
              @click=${() => this.#pick(index)}
              @keydown=${(e: KeyboardEvent) => this.#onKeydown(e, index)}
            >
              ${option.label}
            </button>
          `,
        )}
      </div>
    `
  }

  #onKeydown(e: KeyboardEvent, index: number): void {
    let step: number
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        step = 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        step = -1
        break
      default:
        return
    }
    e.preventDefault()
    const count = this.options.length
    for (let i = 1; i < count; i++) {
      const next = (index + step * i + count) % count
      if (this.#enabled(this.options[next])) {
        this.#pick(next)
        return
      }
    }
  }

  async #pick(index: number): Promise<void> {
    const option = this.options[index]
    if (!option || !this.#enabled(option)) return
    if (option.value !== this.value) {
      this.value = option.value
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    }
    // The picked segment becomes the Tab stop on the next render; move focus
    // there once it exists (a keyboard pick starts on a different segment).
    await this.updateComplete
    this.shadowRoot?.querySelectorAll<HTMLButtonElement>('button[role="radio"]')[index]?.focus()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-segmented-control': DcSegmentedControl
  }
}
