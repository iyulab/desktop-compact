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

  it('renders an internal activator button and leaves the host non-interactive when activator-label is set', async () => {
    const el = await fixture<DcCard>(html`<dc-card activator-label="Open project">Content</dc-card>`)
    expect(el.hasAttribute('role')).to.be.false
    expect(el.hasAttribute('tabindex')).to.be.false
    const button = el.shadowRoot?.querySelector('button.dc-card-activator')
    expect(button).to.exist
    expect(button?.getAttribute('aria-label')).to.equal('Open project')
  })

  it('dispatches dc-activate when the activator button is clicked, without a native click reaching the host', async () => {
    const el = await fixture<DcCard>(html`<dc-card activator-label="Open project">Content</dc-card>`)
    let hostClicks = 0
    el.addEventListener('click', () => hostClicks++)
    const button = el.shadowRoot?.querySelector<HTMLButtonElement>('button.dc-card-activator')
    setTimeout(() => button?.click())
    const event = await oneEvent(el, 'dc-activate')
    expect(event).to.exist
    expect(hostClicks).to.equal(0)
  })

  it('does not render an activator button when activator-label is absent', async () => {
    const el = await fixture<DcCard>(html`<dc-card>Content</dc-card>`)
    expect(el.shadowRoot?.querySelector('button.dc-card-activator')).to.not.exist
  })

  it('is accessible with an activator label', async () => {
    const el = await fixture<DcCard>(html`<dc-card activator-label="Open project">Content</dc-card>`)
    await expect(el).to.be.accessible()
  })
})
