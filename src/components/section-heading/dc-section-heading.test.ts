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

  it('draws no marker by default', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="Sessions"></dc-section-heading>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('h3')!, '::before').content).to.equal('none')
  })

  it('draws a marker bar in the section marker color when marker is set', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading marker heading="Sessions" style="--dc-section-marker-color: rgb(9, 8, 7)"></dc-section-heading>`)
    const before = getComputedStyle(el.shadowRoot!.querySelector('h3')!, '::before')
    expect(before.backgroundColor).to.equal('rgb(9, 8, 7)')
    expect(el.hasAttribute('marker')).to.be.true
  })

  it('reads the role tokens for weight and description color', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="A" description="B" style="--dc-section-title-weight: 700; --dc-section-description-color: rgb(1, 1, 1)"></dc-section-heading>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('h3')!).fontWeight).to.equal('700')
    expect(getComputedStyle(el.shadowRoot!.querySelector('p')!).color).to.equal('rgb(1, 1, 1)')
  })

  it('keeps its previous look without the tokens file', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="A" description="B"></dc-section-heading>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('h3')!).fontWeight).to.equal('600')
    expect(getComputedStyle(el.shadowRoot!.querySelector('p')!).color).to.equal('rgb(138, 138, 146)')
  })

  it('is accessible', async () => {
    const el = await fixture<DcSectionHeading>(html`<dc-section-heading heading="Recent runs"></dc-section-heading>`)
    await expect(el).to.be.accessible()
  })
})
