import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-card.js'
import type { DcCard } from './dc-card.js'

describe('dc-card', () => {
  it('renders slotted content', async () => {
    const el = await fixture<DcCard>(html`<dc-card>Content</dc-card>`)
    expect(el.textContent?.trim()).to.equal('Content')
  })

  it('is not focusable when non-interactive', async () => {
    const el = await fixture<DcCard>(html`<dc-card>Content</dc-card>`)
    expect(el.hasAttribute('tabindex')).to.be.false
    expect(el.hasAttribute('role')).to.be.false
  })

  it('becomes keyboard-focusable when interactive', async () => {
    const el = await fixture<DcCard>(html`<dc-card interactive>Content</dc-card>`)
    expect(el.getAttribute('role')).to.equal('button')
    expect(el.tabIndex).to.equal(0)
  })

  it('dispatches dc-activate on Enter when interactive', async () => {
    const el = await fixture<DcCard>(html`<dc-card interactive>Content</dc-card>`)
    setTimeout(() => el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })))
    const event = await oneEvent(el, 'dc-activate')
    expect(event).to.exist
  })

  it('is accessible', async () => {
    const el = await fixture<DcCard>(html`<dc-card interactive>Content</dc-card>`)
    await expect(el).to.be.accessible()
  })
})
