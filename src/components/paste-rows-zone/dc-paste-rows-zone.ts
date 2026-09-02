import { html, css, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { parseClipboardRows } from '../../lib/clipboard-rows.js'

/**
 * Paste-only target for bulk Excel/Word row import. Parses a tab-separated paste into a row
 * matrix and dispatches it - display-only, like `dc-toast`: no internal "imported/skipped"
 * feedback UI, since that would require baking in locale-interpolated text. A consumer wanting
 * that feedback composes this with `dc-toast`.
 */
@customElement('dc-paste-rows-zone')
export class DcPasteRowsZone extends LitElement {
  static styles = css`
    textarea {
      box-sizing: border-box;
      display: block;
      width: 100%;
      resize: none;
      text-align: center;
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border: 1px dashed var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-sm, 4px);
      background: transparent;
      color: var(--dc-color-text-secondary, #55555c);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-sm, 12px);
      cursor: text;
    }
    textarea::placeholder {
      color: inherit;
    }
    textarea:hover {
      border-color: var(--dc-color-accent, #2563eb);
    }
    textarea:focus-visible {
      outline: none;
      border-color: var(--dc-color-accent, #2563eb);
    }
  `

  @property()
  placeholder = ''

  @query('textarea')
  private _inner!: HTMLTextAreaElement

  private _handleInput(): void {
    this._inner.value = ''
  }

  private _handlePaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text/plain') ?? ''
    if (!text.trim()) return
    event.preventDefault()
    const { rows, skippedEmpty } = parseClipboardRows(text)
    if (rows.length === 0) return
    this.dispatchEvent(
      new CustomEvent('rows', { detail: { rows, skippedEmpty }, bubbles: true, composed: true }),
    )
  }

  render() {
    return html`
      <textarea
        rows="1"
        .value=${''}
        placeholder=${this.placeholder}
        @input=${this._handleInput}
        @paste=${this._handlePaste}
        part="textarea"
      ></textarea>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-paste-rows-zone': DcPasteRowsZone
  }
}
