import { html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { LitElement } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
export type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonSize = 'sm' | 'md'

/** Input types whose Enter submits a form (HTML implicit submission): the text-like ones. */
const IMPLICIT_SUBMIT_TYPES = new Set([
  'text', 'search', 'url', 'tel', 'email', 'password', 'number',
  'date', 'month', 'week', 'time', 'datetime-local',
])

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
    :host([variant='outline']) button {
      background: transparent;
      /* The accent is a fill; as a label on the page ground it needs the shade chosen
         to read there. Hosts that define one pass it as --dc-color-accent-text, the
         same hook dp-sidebar reads; without it the label keeps the accent. */
      color: var(--dc-color-accent-text, var(--dc-color-accent, #2563eb));
      border-color: var(--dc-color-accent, #2563eb);
    }
    :host([size='sm']) button {
      padding: var(--dc-space-1, 4px) var(--dc-space-2, 8px);
      font-size: var(--dc-font-size-sm, 12px);
    }
  `

  @property({ reflect: true })
  variant: ButtonVariant = 'secondary'

  @property({ reflect: true })
  size: ButtonSize = 'md'

  @property({ reflect: true })
  type: ButtonType = 'button'

  // The inner <button> is what assistive technology reads, so the states a button announces are
  // taken from the host's attributes, set the ordinary way, and follow their changes: a menu or
  // popup trigger (aria-haspopup, aria-expanded) and a toggle (aria-pressed). Named apart from the
  // native ARIA reflection properties so the element's own ariaExpanded etc. stay untouched.
  @property({ attribute: 'aria-haspopup' })
  popupKind?: string

  @property({ attribute: 'aria-expanded' })
  expandedState?: string

  @property({ attribute: 'aria-pressed' })
  pressedState?: string

  // Enter in a text field submits a form through its default button — the first submit button.
  // A form-associated custom element cannot be that button, so a form whose submit button is a
  // dc-button did not submit on Enter at all. The first dc-button[type=submit] of a form that has
  // no native submit button (the browser already handles those) submits it the same way: from a
  // text-like input, not a textarea, and not while disabled. Taking the keydown's default keeps a
  // single-field form, which a browser submits on Enter by itself, from submitting twice.
  #listeningTo: HTMLFormElement | null = null

  #onFormKeydown = (e: Event): void => {
    const key = e as KeyboardEvent
    if (key.key !== 'Enter' || key.defaultPrevented || key.isComposing || this.disabled) return
    const form = this.#listeningTo
    if (!form) return
    const origin = e.composedPath()[0]
    if (!(origin instanceof HTMLInputElement) || !IMPLICIT_SUBMIT_TYPES.has(origin.type)) return
    const controls = [...form.elements]
    const nativeSubmit = controls.some((el) =>
      (el instanceof HTMLButtonElement && el.type === 'submit') ||
      (el instanceof HTMLInputElement && (el.type === 'submit' || el.type === 'image')))
    if (nativeSubmit) return
    const defaultButton = controls.find((el) => el.localName === 'dc-button' && (el as DcButton).type === 'submit')
    if (defaultButton !== this) return
    key.preventDefault()
    form.requestSubmit()
  }

  #listen(form: HTMLFormElement | null): void {
    if (form === this.#listeningTo) return
    this.#listeningTo?.removeEventListener('keydown', this.#onFormKeydown)
    this.#listeningTo = form
    form?.addEventListener('keydown', this.#onFormKeydown)
  }

  #syncImplicitSubmit(): void {
    this.#listen(this.isConnected && this.type === 'submit' ? this.internals.form : null)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.#syncImplicitSubmit()
  }

  disconnectedCallback(): void {
    this.#listen(null)
    super.disconnectedCallback()
  }

  formAssociatedCallback(): void {
    this.#syncImplicitSubmit()
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed)
    if (changed.has('type')) this.#syncImplicitSubmit()
  }

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
      <button
        type="button"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        aria-haspopup=${ifDefined(this.popupKind ?? undefined)}
        aria-expanded=${ifDefined(this.expandedState ?? undefined)}
        aria-pressed=${ifDefined(this.pressedState ?? undefined)}
        @click=${this._handleClick}
        part="button"
      >
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
