export interface ParsedPaste {
  /** Non-empty rows, each an array of tab-split, trimmed cells. */
  rows: string[][]
  /** Interior blank rows that were dropped (leading/trailing blanks are not counted). */
  skippedEmpty: number
}

const isBlank = (cells: string[]): boolean => cells.every((c) => c === '')

/** Clipboard TSV (tab-separated values, as Excel/Word copy produces) into a row matrix. */
export function parseClipboardRows(text: string): ParsedPaste {
  const matrix = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.split('\t').map((c) => c.trim()))

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
