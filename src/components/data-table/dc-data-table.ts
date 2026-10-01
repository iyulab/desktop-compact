import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export interface DataTableColumn {
  /** The key of this column's cell in each row. */
  key: string
  /** The column heading — consumer-supplied, like every string here. */
  label: string
}

export interface DataTableRow {
  /** Identifies the row in `activate` events. */
  id: string
  /** Cell text by column key; a missing key is an empty cell. */
  cells: Record<string, string>
}

/**
 * A read-only table of records whose rows open something: the header stays in view while the
 * rows scroll, and each row can be activated — by a click anywhere on it, or from the keyboard
 * through the button its header cell holds (the row header, `<th scope="row">`). A click that ends
 * a text selection is left to the selection. Cells keep the line breaks their text has.
 *
 * Activating a row dispatches `activate` with `{ id }`.
 */
@customElement('dc-data-table')
export class DcDataTable extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 0;
      overflow: auto;
      border: 1px solid var(--dc-color-border, #e2e2e4);
      border-radius: var(--dc-radius-md, 6px);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-color-text, #1a1a1e);
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th,
    td {
      text-align: left;
      vertical-align: top;
      padding: var(--dc-space-2, 8px);
      border-bottom: 1px solid var(--dc-table-rule, var(--dc-color-border, #e2e2e4));
      white-space: pre-line;
    }
    thead th {
      position: sticky;
      top: 0;
      background: var(--dc-table-header-bg, var(--dc-color-surface, #f4f4f5));
      color: var(--dc-table-header-color, var(--dc-color-text, #1a1a1e));
      font-weight: var(--dc-font-weight-semibold, 600);
    }
    tbody tr {
      cursor: pointer;
    }
    tbody tr:hover {
      background: var(--dc-color-surface-hover, #ececee);
    }
    tbody tr:last-child > * {
      border-bottom: none;
    }
    th[scope='row'] {
      font-weight: inherit;
    }
    .open {
      all: unset;
      cursor: pointer;
      white-space: pre-line;
      text-decoration: underline;
      text-decoration-color: var(--dc-color-border, #e2e2e4);
      text-underline-offset: 3px;
    }
    .open:focus-visible {
      outline: 2px solid var(--dc-color-accent, #2563eb);
      outline-offset: 2px;
      border-radius: var(--dc-radius-sm, 4px);
    }
    .empty {
      margin: 0;
      padding: var(--dc-space-4, 16px);
      color: var(--dc-color-text-muted, #8a8a92);
    }
  `

  @property({ attribute: false })
  columns: DataTableColumn[] = []

  @property({ attribute: false })
  rows: DataTableRow[] = []

  /** The column that names each row; the first column when not set. */
  @property({ attribute: 'row-header' })
  rowHeader = ''

  /** Shown instead of the table body when there are no rows. */
  @property({ attribute: 'empty-label' })
  emptyLabel = ''

  private _activate(id: string): void {
    if (getSelection()?.toString()) return
    this.dispatchEvent(new CustomEvent('activate', { detail: { id }, bubbles: true, composed: true }))
  }

  render() {
    const header = this.rowHeader || this.columns[0]?.key
    if (this.rows.length === 0) {
      return this.emptyLabel ? html`<p class="empty">${this.emptyLabel}</p>` : nothing
    }
    return html`<table>
      <thead>
        <tr>
          ${this.columns.map((c) => html`<th scope="col">${c.label}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${this.rows.map(
          (row) => html`<tr @click=${() => this._activate(row.id)}>
            ${this.columns.map((c) =>
              c.key === header
                ? // No whitespace inside the cell: it keeps line breaks (pre-line).
                  html`<th scope="row"><button
                      class="open"
                      @click=${(e: Event) => {
                        e.stopPropagation()
                        this._activate(row.id)
                      }}
                    >${row.cells[c.key] ?? ''}</button></th>`
                : html`<td>${row.cells[c.key] ?? ''}</td>`,
            )}
          </tr>`,
        )}
      </tbody>
    </table>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-data-table': DcDataTable
  }
}
