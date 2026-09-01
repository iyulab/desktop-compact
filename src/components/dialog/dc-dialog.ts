import { html, css, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import type { PropertyValues } from 'lit'

@customElement('dc-dialog')
export class DcDialog extends LitElement {
  static styles = css`
    dialog {
      box-sizing: border-box;
      padding: var(--dc-space-4, 16px);
      border: 1px solid var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-lg, 10px);
      background: var(--dc-color-bg, #ffffff);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-md, 13px);
      max-width: min(480px, calc(100vw - var(--dc-space-6, 24px) * 2));
    }
    dialog::backdrop {
      background: var(--dc-color-backdrop, rgba(0, 0, 0, 0.4));
    }
  `

  @property({ type: Boolean, reflect: true })
  open = false

  @query('dialog')
  private _inner!: HTMLDialogElement

  private _stateObserver?: MutationObserver

  firstUpdated(): void {
    // The native `close` event is the standards-documented way to observe a dialog closing for
    // any reason (backdrop click, Escape, or a script calling close()) - kept below via `@close`
    // as the primary signal. It was found, while implementing this component, to not reliably
    // fire for a <dialog> rendered through Lit's template system in at least one browser build
    // (confirmed independent of Shadow DOM - reproduced with a light-DOM render root too - and
    // independent of timing, holding at waits up to 10 seconds). The dialog's own `open` property
    // was confirmed to update correctly in every case, so a MutationObserver on that attribute is
    // the fallback that makes this component correct regardless of whether the event fires in a
    // given browser. `_syncClosed()` is idempotent (checked against `this.open`), so whichever of
    // the two signals arrives first is the one that takes effect - no double state change, no
    // double-dispatched event.
    this._stateObserver = new MutationObserver(() => {
      if (!this._inner.open) this._syncClosed()
    })
    this._stateObserver.observe(this._inner, { attributes: true, attributeFilter: ['open'] })
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this._stateObserver?.disconnect()
  }

  protected updated(changed: PropertyValues<this>): void {
    if (!changed.has('open')) return
    if (this.open && !this._inner.open) {
      this._inner.showModal()
    } else if (!this.open && this._inner.open) {
      this._inner.close()
    }
  }

  private _handleClick(event: MouseEvent): void {
    if (event.target === this._inner) {
      this._inner.close()
    }
  }

  private _syncClosed(): void {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      <dialog
        aria-label=${ifDefined(this.ariaLabel ?? undefined)}
        @click=${this._handleClick}
        @close=${this._syncClosed}
        part="dialog"
      >
        <div part="content"><slot></slot></div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-dialog': DcDialog
  }
}
