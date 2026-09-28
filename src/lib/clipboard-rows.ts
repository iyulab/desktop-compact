export interface ParsedPaste {
  /** Non-empty rows, each an array of tab-split, trimmed cells. */
  rows: string[][]
  /** Interior blank rows that were dropped (leading/trailing blanks are not counted). */
  skippedEmpty: number
}

const isBlank = (cells: string[]): boolean => cells.every((c) => c === '')

/**
 * Clipboard TSV (tab-separated values, as Excel/Word copy produces) into a row matrix.
 *
 * A cell that starts with `"` is read the way spreadsheets quote it: it may hold tabs and line
 * breaks, and `""` inside it is one `"`. A cell that only looks quoted — its closing quote is not
 * followed by a tab or the end of the row — is taken as written.
 */
export function parseClipboardRows(text: string): ParsedPaste {
  const matrix = splitCells(text.replace(/\r\n?/g, '\n')).map((cells) => cells.map((c) => c.trim()))

  let start = 0
  let end = matrix.length
  while (start < end && isBlank(matrix[start])) start++
  while (end > start && isBlank(matrix[end - 1])) end--

  const rows: string[][] = []
  let skippedEmpty = 0
  for (const cells of matrix.slice(start, end)) {
    if (isBlank(cells)) skippedEmpty++
    else rows.push(cells)
  }
  return { rows, skippedEmpty }
}

function splitCells(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let i = 0
  for (;;) {
    const quoted = text[i] === '"' ? readQuoted(text, i) : undefined
    let end: number
    if (quoted) {
      row.push(quoted.value)
      end = quoted.end
    } else {
      end = i
      while (end < text.length && text[end] !== '\t' && text[end] !== '\n') end++
      row.push(text.slice(i, end))
    }
    if (end >= text.length) {
      rows.push(row)
      return rows
    }
    if (text[end] === '\n') {
      rows.push(row)
      row = []
    }
    i = end + 1
  }
}

/** A quoted cell starting at `start`, and where it ends; undefined if it is not properly closed. */
function readQuoted(text: string, start: number): { value: string; end: number } | undefined {
  let value = ''
  let from = start + 1
  for (;;) {
    const quote = text.indexOf('"', from)
    if (quote < 0) return undefined
    value += text.slice(from, quote)
    if (text[quote + 1] === '"') {
      value += '"'
      from = quote + 2
      continue
    }
    const next = text[quote + 1]
    if (next === undefined || next === '\t' || next === '\n') return { value, end: quote + 1 }
    return undefined
  }
}
