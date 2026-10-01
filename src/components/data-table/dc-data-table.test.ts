import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-data-table.js'
import type { DcDataTable, DataTableColumn, DataTableRow } from './dc-data-table.js'

const columns: DataTableColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'severity', label: 'Severity' },
  { key: 'steps', label: 'Steps' },
]
const rows: DataTableRow[] = [
  { id: 'a.md', cells: { title: 'Freezes after saving', severity: 'High', steps: '1. Open\n2. Save' } },
  { id: 'b.md', cells: { title: 'Slow to open' } },
]

async function table(props: Partial<DcDataTable> = {}): Promise<DcDataTable> {
  const el = await fixture<DcDataTable>(html`<dc-data-table .columns=${columns} .rows=${rows}></dc-data-table>`)
  Object.assign(el, props)
  await el.updateComplete
  return el
}

describe('dc-data-table', () => {
  it('shows the headings and a row per record, missing cells empty', async () => {
    const el = await table()
    const root = el.shadowRoot!
    expect([...root.querySelectorAll('thead th')].map((th) => th.textContent)).to.deep.equal([
      'Title',
      'Severity',
      'Steps',
    ])
    const cells = [...root.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent))
    expect(cells).to.deep.equal([
      ['Freezes after saving', 'High', '1. Open\n2. Save'],
      ['Slow to open', '', ''],
    ])
  })

  it('names each row with a row header holding a button', async () => {
    const el = await table()
    const headers = el.shadowRoot!.querySelectorAll('tbody th[scope="row"] button')
    expect([...headers].map((b) => b.textContent)).to.deep.equal(['Freezes after saving', 'Slow to open'])
  })

  it('uses the chosen column as the row header', async () => {
    const el = await table({ rowHeader: 'severity' })
    const header = el.shadowRoot!.querySelector('tbody tr th[scope="row"]')!
    expect(header.textContent).to.equal('High')
    expect(header.previousElementSibling?.tagName).to.equal('TD')
  })

  it('activates a row from its button, once', async () => {
    const el = await table()
    let count = 0
    el.addEventListener('activate', () => count++)
    const event = oneEvent(el, 'activate')
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>('tbody button')[1].click()
    expect((await event).detail).to.deep.equal({ id: 'b.md' })
    expect(count).to.equal(1)
  })

  it('activates a row from a click on any of its cells', async () => {
    const el = await table()
    const event = oneEvent(el, 'activate')
    el.shadowRoot!.querySelector<HTMLElement>('tbody td')!.click()
    expect((await event).detail).to.deep.equal({ id: 'a.md' })
  })

  it('leaves a click that ends a text selection to the selection', async () => {
    const el = await table()
    let count = 0
    el.addEventListener('activate', () => count++)
    const cell = el.shadowRoot!.querySelector<HTMLElement>('tbody td')!
    getSelection()!.selectAllChildren(cell)
    cell.click()
    getSelection()!.removeAllRanges()
    expect(count).to.equal(0)
  })

  it('shows the empty label instead of a table when there are no rows', async () => {
    const el = await table({ rows: [], emptyLabel: 'No records yet' })
    expect(el.shadowRoot!.querySelector('table')).to.equal(null)
    expect(el.shadowRoot!.querySelector('.empty')!.textContent).to.equal('No records yet')
  })

  it('paints the header and the rules with the table role tokens', async () => {
    const el = await table()
    el.style.setProperty('--dc-table-header-bg', 'rgb(10, 20, 30)')
    el.style.setProperty('--dc-table-rule', 'rgb(40, 50, 60)')
    const root = el.shadowRoot!
    expect(getComputedStyle(root.querySelector('thead th')!).backgroundColor).to.equal('rgb(10, 20, 30)')
    expect(getComputedStyle(root.querySelector('tbody tr > *')!).borderBottomColor).to.equal('rgb(40, 50, 60)')
  })

  it('draws its rules in the rule color when no table rule is set', async () => {
    const el = await table()
    el.style.setProperty('--dc-color-rule', 'rgb(70, 80, 90)')
    expect(getComputedStyle(el.shadowRoot!.querySelector('tbody tr > *')!).borderBottomColor).to.equal('rgb(70, 80, 90)')
  })

  it('is accessible', async () => {
    const el = await table()
    await expect(el).to.be.accessible()
  })
})
