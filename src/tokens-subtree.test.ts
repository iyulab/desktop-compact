import { fixtureSync, html, expect } from '@open-wc/testing'
import './components/card/dc-card.js'
import './components/badge/dc-badge.js'
import './components/data-table/dc-data-table.js'
import type { DcDataTable } from './components/data-table/dc-data-table.js'

// With tokens.css loaded, a base token overridden on a subtree (a panel with its own surface or
// accent) must still reach every component inside it, including those that read a role token.
// The wrappers are plain elements, so they are mounted with fixtureSync: fixture() would wait for an
// animation frame, which a background test page may not get.

/** The computed background of `css` painted on a probe element in the same document. */
function computedBackground(css: string): string {
  const probe = document.createElement('div')
  probe.style.background = css
  document.body.append(probe)
  const value = getComputedStyle(probe).backgroundColor
  probe.remove()
  return value
}

describe('tokens.css on a themed subtree', () => {
  let link: HTMLLinkElement

  before(async () => {
    link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/tokens.css'
    const loaded = new Promise((resolve, reject) => {
      link.addEventListener('load', resolve)
      link.addEventListener('error', reject)
    })
    document.head.append(link)
    await loaded
  })

  after(() => link.remove())

  it('loads the token stylesheet', () => {
    expect(getComputedStyle(document.documentElement).getPropertyValue('--dc-color-surface').trim()).to.equal('#f7f7f8')
  })

  it('lets a subtree surface reach a card and a table header', async () => {
    const root = fixtureSync<HTMLDivElement>(html`
      <div style="--dc-color-surface: rgb(1, 2, 3); --dc-color-border: rgb(4, 5, 6)">
        <dc-card>Content</dc-card>
        <dc-data-table .columns=${[{ key: 'a', label: 'A' }]} .rows=${[{ id: '1', cells: { a: 'x' } }]}></dc-data-table>
      </div>
    `)
    const card = root.querySelector('dc-card')!
    await card.updateComplete
    expect(getComputedStyle(card).backgroundColor).to.equal('rgb(1, 2, 3)')
    const table = root.querySelector<DcDataTable>('dc-data-table')!
    await table.updateComplete
    const th = table.shadowRoot!.querySelector('thead th')!
    expect(getComputedStyle(th).backgroundColor).to.equal('rgb(1, 2, 3)')
    // The header's rule is the table rule (the last body row draws none).
    expect(getComputedStyle(th).borderBottomColor).to.equal('rgb(4, 5, 6)')
  })

  it('lets a subtree accent reach a badge tint', async () => {
    const root = fixtureSync<HTMLDivElement>(html`
      <div style="--dc-color-accent: rgb(0, 0, 200)"><dc-badge variant="accent">New</dc-badge></div>
    `)
    const badge = root.querySelector('dc-badge')!
    await badge.updateComplete
    const span = badge.shadowRoot!.querySelector('span')!
    const ground = getComputedStyle(span).backgroundColor
    expect(ground).to.equal(computedBackground('color-mix(in srgb, rgb(0, 0, 200) 15%, transparent)'))
    expect(ground).not.to.equal(computedBackground('color-mix(in srgb, #2563eb 15%, transparent)'))
  })
})
