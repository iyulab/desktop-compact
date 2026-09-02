import { expect } from '@open-wc/testing'
import { parseClipboardRows } from './clipboard-rows.js'

describe('parseClipboardRows', () => {
  it('parses a single row of tab-separated cells', () => {
    const { rows, skippedEmpty } = parseClipboardRows('a\tb\tc')
    expect(rows).to.deep.equal([['a', 'b', 'c']])
    expect(skippedEmpty).to.equal(0)
  })

  it('parses multiple rows separated by newlines', () => {
    const { rows } = parseClipboardRows('a\tb\nc\td')
    expect(rows).to.deep.equal([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })

  it('normalizes \\r\\n and \\r line endings to \\n', () => {
    const { rows } = parseClipboardRows('a\tb\r\nc\td\re\tf')
    expect(rows).to.deep.equal([
      ['a', 'b'],
      ['c', 'd'],
      ['e', 'f'],
    ])
  })

  it('trims leading and trailing fully-blank lines without counting them as skipped', () => {
    const { rows, skippedEmpty } = parseClipboardRows('\n\na\tb\n\n')
    expect(rows).to.deep.equal([['a', 'b']])
    expect(skippedEmpty).to.equal(0)
  })

  it('counts interior fully-blank lines as skipped and drops them', () => {
    const { rows, skippedEmpty } = parseClipboardRows('a\tb\n\nc\td')
    expect(rows).to.deep.equal([
      ['a', 'b'],
      ['c', 'd'],
    ])
    expect(skippedEmpty).to.equal(1)
  })

  it('trims surrounding whitespace from each cell', () => {
    const { rows } = parseClipboardRows('  a  \t  b  ')
    expect(rows).to.deep.equal([['a', 'b']])
  })

  it('returns no rows for entirely blank input', () => {
    const { rows, skippedEmpty } = parseClipboardRows('   \n\t\n  ')
    expect(rows).to.deep.equal([])
    expect(skippedEmpty).to.equal(0)
  })
})
