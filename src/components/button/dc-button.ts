import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { LitElement } from 'lit'
import { FormAssociatedMixin } from '../../mixins/form-associated.js'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
export type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonSize = 'sm' | 'md'

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
