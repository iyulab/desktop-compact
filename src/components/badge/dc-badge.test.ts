import { fixture, html, expect } from '@open-wc/testing'
import './dc-badge.js'
import type { DcBadge } from './dc-badge.js'

describe('dc-badge', () => {
  it('renders slotted content', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge>Active</dc-badge>`)
    expect(el.textContent?.trim()).to.equal('Active')
  })

  it('defaults to the default variant', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge></dc-badge>`)
    expect(el.variant).to.equal('default')
    expect(el.getAttribute('variant')).to.equal('default')
  })

  it('reflects the variant attribute', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge variant="danger"></dc-badge>`)
    expect(el.variant).to.equal('danger')
    expect(el.getAttribute('variant')).to.equal('danger')
  })

  it('is accessible', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge>Active</dc-badge>`)
    await expect(el).to.be.accessible()
  })
})
