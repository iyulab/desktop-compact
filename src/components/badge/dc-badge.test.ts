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

  it('paints each tinted variant label with its text colour, over a tint of the fill', async () => {
    for (const v of ['accent', 'success', 'warning', 'danger'] as const) {
      const el = await fixture<DcBadge>(
        html`<dc-badge variant=${v} style=${`--dc-color-${v}: rgb(10, 20, 30); --dc-color-${v}-text: rgb(1, 2, 3)`}>x</dc-badge>`,
      )
      expect(getComputedStyle(el.shadowRoot!.querySelector('span')!).color, v).to.equal('rgb(1, 2, 3)')
    }
  })

  it('has a secondary variant: subtle ground, secondary text', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge variant="secondary" style="--dc-color-secondary-subtle: rgb(1, 2, 3); --dc-color-secondary-text: rgb(4, 5, 6)">x</dc-badge>`)
    const span = el.shadowRoot!.querySelector('span')!
    expect(getComputedStyle(span).backgroundColor).to.equal('rgb(1, 2, 3)')
    expect(getComputedStyle(span).color).to.equal('rgb(4, 5, 6)')
  })

  it('reads the subtle-ground token for its tinted variants', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge variant="warning" style="--dc-color-warning-subtle: rgb(7, 8, 9)">x</dc-badge>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('span')!).backgroundColor).to.equal('rgb(7, 8, 9)')
  })

  it('keeps its previous ground when no subtle token is defined (an app without the tokens file)', async () => {
    const el = await fixture<DcBadge>(html`<dc-badge variant="accent" style="--dc-color-accent: rgb(0, 0, 200)">x</dc-badge>`)
    const bg = getComputedStyle(el.shadowRoot!.querySelector('span')!).backgroundColor
    expect(bg).to.match(/0\.15\)$|color\(srgb 0 0 0\.78\d* \/ 0\.15\)/)
  })
})
