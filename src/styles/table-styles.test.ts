import { fixture, html, expect } from '@open-wc/testing'
import { LitElement, css } from 'lit'
import { tableStyles } from './table-styles.js'

class TableHost extends LitElement {
  static styles = [tableStyles, css``]
  render() {
    return html`<table>
      <thead><tr><th>Topic</th><th class="num">Count</th></tr></thead>
      <tbody><tr><th>Peers</th><td class="num">12</td></tr></tbody>
      <tfoot><tr><th>Total</th><td class="num">12</td></tr></tfoot>
    </table>`
  }
}
customElements.define('table-styles-host', TableHost)

describe('tableStyles', () => {
  it('right-aligns numbers in tabular figures', async () => {
    const el = await fixture<TableHost>(html`<table-styles-host></table-styles-host>`)
    const num = el.shadowRoot!.querySelector('td.num')!
    expect(getComputedStyle(num).textAlign).to.equal('right')
    expect(getComputedStyle(num).fontVariantNumeric).to.contain('tabular-nums')
  })

  it('reads the table role tokens for the header and the total rule', async () => {
    const el = await fixture<TableHost>(html`<table-styles-host style="--dc-table-header-bg: rgb(1, 1, 1); --dc-table-total-rule: rgb(2, 2, 2)"></table-styles-host>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('thead th')!).backgroundColor).to.equal('rgb(1, 1, 1)')
    expect(getComputedStyle(el.shadowRoot!.querySelector('tfoot td')!).borderTopColor).to.equal('rgb(2, 2, 2)')
  })

  it('keeps the header row in view while the rows scroll in a bounded box, its rule going with it', async () => {
    const el = await fixture<TableHost>(html`<table-styles-host style="--dc-table-rule: rgb(3, 3, 3)"></table-styles-host>`)
    const th = el.shadowRoot!.querySelector('thead th')!
    expect(getComputedStyle(th).position).to.equal('sticky')
    expect(getComputedStyle(th).top).to.equal('0px')
    expect(getComputedStyle(th).boxShadow).to.contain('rgb(3, 3, 3)')
  })

  it('bolds the total row', async () => {
    const el = await fixture<TableHost>(html`<table-styles-host></table-styles-host>`)
    expect(Number(getComputedStyle(el.shadowRoot!.querySelector('tfoot td')!).fontWeight)).to.be.at.least(700)
  })
})
