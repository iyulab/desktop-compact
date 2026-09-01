import { fixture, html, expect } from '@open-wc/testing'
import './dc-spinner.js'
import type { DcSpinner } from './dc-spinner.js'

describe('dc-spinner', () => {
  it('defaults to md size (24px)', async () => {
    const el = await fixture<DcSpinner>(html`<dc-spinner></dc-spinner>`)
    expect(el.size).to.equal('md')
    const svg = el.shadowRoot!.querySelector('svg')!
    expect(svg.getAttribute('width')).to.equal('24')
  })

  it('renders the sm size at 16px', async () => {
    const el = await fixture<DcSpinner>(html`<dc-spinner size="sm"></dc-spinner>`)
    const svg = el.shadowRoot!.querySelector('svg')!
    expect(svg.getAttribute('width')).to.equal('16')
  })

  it('renders the lg size at 32px', async () => {
    const el = await fixture<DcSpinner>(html`<dc-spinner size="lg"></dc-spinner>`)
    const svg = el.shadowRoot!.querySelector('svg')!
    expect(svg.getAttribute('width')).to.equal('32')
  })

  it('is accessible', async () => {
    const el = await fixture<DcSpinner>(html`<dc-spinner></dc-spinner>`)
    await expect(el).to.be.accessible()
  })
})
