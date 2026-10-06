import { css } from 'lit'

/**
 * Styles for a semantic `<table>` in a component's shadow root: header row, row headers, numeric
 * cells (`.num`), a totals footer. For tables whose cells hold controls or marks — `dc-data-table`
 * covers plain text grids. Reads the `--dc-table-*` role tokens.
 */
export const tableStyles = css`
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--dc-font-size-md, 13px);
    font-variant-numeric: tabular-nums;
  }
  th,
  td {
    text-align: left;
    padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
    border-bottom: 1px solid var(--dc-table-rule, var(--dc-color-rule, var(--dc-color-border, #e2e2e4)));
    white-space: nowrap;
  }
  /* The header row stays in view while the rows scroll under it, in whatever box scrolls the table. A
     collapsed border stays behind with the rows, so the rule under the header is drawn as a shadow it carries. */
  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: var(--dc-font-size-sm, 12px);
    font-weight: var(--dc-font-weight-semibold, 600);
    color: var(--dc-table-header-color, var(--dc-color-text, #1a1a1e));
    background: var(--dc-table-header-bg, var(--dc-color-surface, #f7f7f8));
    border-bottom: 0;
    box-shadow: inset 0 -1px 0 var(--dc-table-rule, var(--dc-color-rule, var(--dc-color-border, #e2e2e4)));
  }
  tbody th {
    font-weight: var(--dc-font-weight-medium, 500);
  }
  tbody tr:hover > * {
    background: var(--dc-color-surface-hover, #ececed);
  }
  tbody tr:last-child > * {
    border-bottom: 0;
  }
  .num {
    text-align: right;
  }
  tfoot th,
  tfoot td {
    font-weight: var(--dc-font-weight-bold, 700);
    border-top: 1.5px solid var(--dc-table-total-rule, var(--dc-color-text, #1a1a1e));
    border-bottom: 0;
  }
`
