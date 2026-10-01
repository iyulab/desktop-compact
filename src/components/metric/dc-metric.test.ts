import { fixture, html, expect } from '@open-wc/testing'
import './dc-metric.js'
import type { DcMetric } from './dc-metric.js'

describe('dc-metric', () => {
  it('shows label, value and unit, the value in tabular figures at the metric size', async () => {
    const el = await fixture<DcMetric>(html`<dc-metric label="People" value="38" unit="people" style="--dc-metric-size: 30px">Up 6 on last month</dc-metric>`)
    const value = el.shadowRoot!.querySelector('.value') as HTMLElement
    expect(el.shadowRoot!.querySelector('.label')!.textContent!.trim()).to.equal('People')
    expect(value.textContent!.replace(/\s+/g, ' ').trim()).to.equal('38 people')
    expect(getComputedStyle(value).fontSize).to.equal('30px')
    expect(getComputedStyle(value).fontVariantNumeric).to.contain('tabular-nums')
  })

  it('draws no band without an accent, and the accent band when set', async () => {
    const plain = await fixture<DcMetric>(html`<dc-metric label="A" value="1"></dc-metric>`)
    expect(getComputedStyle(plain, '::before').content).to.equal('none')
    const one = await fixture<DcMetric>(html`<dc-metric accent="1" label="A" value="1" style="--dc-metric-accent-1: rgb(9, 9, 9)"></dc-metric>`)
    expect(getComputedStyle(one, '::before').backgroundColor).to.equal('rgb(9, 9, 9)')
    const two = await fixture<DcMetric>(html`<dc-metric accent="2" label="A" value="1" style="--dc-metric-accent-2: rgb(8, 8, 8)"></dc-metric>`)
    expect(getComputedStyle(two, '::before').backgroundColor).to.equal('rgb(8, 8, 8)')
  })

  it('wears the card tokens', async () => {
    const el = await fixture<DcMetric>(html`<dc-metric label="A" value="1" style="--dc-card-bg: rgb(7, 7, 7)"></dc-metric>`)
    expect(getComputedStyle(el).backgroundColor).to.equal('rgb(7, 7, 7)')
  })

  it('is accessible', async () => {
    const el = await fixture<DcMetric>(html`<dc-metric accent="1" label="People" value="38" unit="people">Up 6</dc-metric>`)
    await expect(el).to.be.accessible()
  })
})
