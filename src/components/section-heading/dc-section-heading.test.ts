import { fixture, html, expect } from '@open-wc/testing'
import './dc-section-heading.js'
import type { DcSectionHeading } from './dc-section-heading.js'

describe('dc-section-heading', () => {
  it('renders the heading text', async () => {
    const el = await fixture<DcSectionHeading>(
      html`<dc-section-heading heading="Recent runs"></dc-section-heading>`
    )
    expect(el.shadowRoot!.querySelector('h3')!.textContent).to.equal('Recent runs')
  })

  it('omits the description paragraph when none is given', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="Recent runs"></dc-section-heading>`)
    expect(el.shadowRoot!.querySelector('p')).to.be.null
  })

  it('defaults to md size', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="Recent runs"></dc-section-heading>`)
    expect(el.size).to.equal('md')
  })

  it('is accessible', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="Recent runs"></dc-section-heading>`)
    await expect(el).to.be.accessible()
  })
})
