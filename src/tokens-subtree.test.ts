import { fixtureSync, html, expect } from '@open-wc/testing'
import './components/card/dc-card.js'
import './components/badge/dc-badge.js'
import './components/input/dc-input.js'
import './components/select/dc-select.js'
import './components/textarea/dc-textarea.js'
import './components/data-table/dc-data-table.js'
import './components/button/dc-button.js'
import './components/segmented-control/dc-segmented-control.js'
import './components/paste-rows-zone/dc-paste-rows-zone.js'
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

  it('draws text controls on the page ground, or on the control ground a subtree sets', async () => {
    const root = fixtureSync<HTMLDivElement>(html`
      <div style="--dc-color-bg: rgb(7, 8, 9)">
        <dc-input></dc-input><dc-select></dc-select><dc-textarea></dc-textarea>
        <div style="--dc-control-bg: rgb(10, 11, 12)"><dc-input></dc-input><dc-select></dc-select><dc-textarea></dc-textarea></div>
      </div>
    `)
    const grounds = await Promise.all(
      [...root.querySelectorAll<HTMLElement & { updateComplete: Promise<boolean> }>('dc-input, dc-select, dc-textarea')].map(async (el) => {
        await el.updateComplete
        return getComputedStyle(el.shadowRoot!.querySelector('input, select, textarea')!).backgroundColor
      }),
    )
    expect(grounds).to.deep.equal([...Array(3).fill('rgb(7, 8, 9)'), ...Array(3).fill('rgb(10, 11, 12)')])
  })

  // Every outline that marks a control's extent: the text controls, the segmented group and the dividers
  // between its segments, a secondary button, and the paste zone.
  const controls = () => html`
    <dc-input></dc-input><dc-select></dc-select><dc-textarea></dc-textarea>
    <dc-segmented-control .options=${[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="a"></dc-segmented-control>
    <dc-button>Save</dc-button><dc-paste-rows-zone></dc-paste-rows-zone>
  `

  /** The outline colours those controls paint under `root`, keyed by what draws them. */
  async function outlines(root: Element): Promise<Record<string, string>> {
    const paint = async (tag: string, selector: string, side: 'borderTopColor' | 'borderLeftColor' = 'borderTopColor') => {
      const el = root.querySelector<HTMLElement & { updateComplete: Promise<boolean> }>(`:scope > ${tag}`)!
      await el.updateComplete
      return getComputedStyle(el.shadowRoot!.querySelector(selector)!)[side]
    }
    return {
      input: await paint('dc-input', 'input'),
      select: await paint('dc-select', 'select'),
      textarea: await paint('dc-textarea', 'textarea'),
      segmentedGroup: await paint('dc-segmented-control', '.group'),
      segmentDivider: await paint('dc-segmented-control', 'button:nth-of-type(2)', 'borderLeftColor'),
      secondaryButton: await paint('dc-button', 'button'),
      pasteZone: await paint('dc-paste-rows-zone', 'textarea'),
    }
  }
  const all = (colour: string) =>
    Object.fromEntries(
      ['input', 'select', 'textarea', 'segmentedGroup', 'segmentDivider', 'secondaryButton', 'pasteZone'].map((k) => [k, colour]),
    )

  it('outlines every control with the control border a subtree sets, and leaves cards alone', async () => {
    const root = fixtureSync<HTMLDivElement>(html`
      <div style="--dc-control-border: rgb(10, 11, 12); --dc-color-border: rgb(7, 8, 9)">${controls()}<dc-card>Body</dc-card></div>
    `)
    expect(await outlines(root)).to.deep.equal(all('rgb(10, 11, 12)'))
    const card = root.querySelector('dc-card')!
    await card.updateComplete
    expect(getComputedStyle(card).borderTopColor).to.equal('rgb(7, 8, 9)')
  })

  it('outlines every control with the border colour when no control border is set', async () => {
    const root = fixtureSync<HTMLDivElement>(html`<div style="--dc-color-border: rgb(7, 8, 9)">${controls()}</div>`)
    expect(await outlines(root)).to.deep.equal(all('rgb(7, 8, 9)'))
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
