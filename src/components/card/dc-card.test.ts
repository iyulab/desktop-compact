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

  it('keeps its previous look without the tokens file', async () => {
    const el = await fixture<DcCard>(html`<dc-card>Body</dc-card>`)
    const s = getComputedStyle(el)
    expect(s.backgroundColor).to.equal('rgb(247, 247, 248)')
    expect(s.borderTopWidth).to.equal('1px')
    expect(s.borderTopLeftRadius).to.equal('6px')
    expect(s.boxShadow).to.equal('none')
    expect(s.paddingTop).to.equal('16px')
    const body = el.shadowRoot!.querySelector('.body') as HTMLElement
    expect(getComputedStyle(body).paddingTop).to.equal('0px')
  })

  it('reads its role tokens', async () => {
    const el = await fixture<DcCard>(html`<dc-card style="--dc-card-bg: rgb(1, 2, 3); --dc-card-border: none; --dc-card-radius: 12px; --dc-card-elevation: 0 1px 2px rgb(0, 0, 0)">Body</dc-card>`)
    const s = getComputedStyle(el)
    expect(s.backgroundColor).to.equal('rgb(1, 2, 3)')
    expect(s.borderTopStyle).to.equal('none')
    expect(s.borderTopLeftRadius).to.equal('12px')
    expect(s.boxShadow).to.contain('rgb(0, 0, 0)')
  })

  it('with a header, draws it above a rule and moves the padding into its parts', async () => {
    const el = await fixture<DcCard>(html`<dc-card><span slot="header">New session <b data-accent>10</b></span>Body</dc-card>`)
    await new Promise((r) => setTimeout(r))
    await el.updateComplete
    expect(el.hasAttribute('has-header')).to.be.true
    expect(getComputedStyle(el).paddingTop).to.equal('0px')
    const header = el.shadowRoot!.querySelector('.header') as HTMLElement
    expect(getComputedStyle(header).borderBottomStyle).to.equal('solid')
    expect(getComputedStyle(el.shadowRoot!.querySelector('.body')!).paddingTop).to.equal('16px')
  })

  it('with a footer, draws it on the footer ground', async () => {
    const el = await fixture<DcCard>(html`<dc-card style="--dc-card-footer-bg: rgb(5, 5, 5)">Body<button slot="footer">Save</button></dc-card>`)
    await new Promise((r) => setTimeout(r))
    await el.updateComplete
    expect(el.hasAttribute('has-footer')).to.be.true
    expect(getComputedStyle(el.shadowRoot!.querySelector('.footer')!).backgroundColor).to.equal('rgb(5, 5, 5)')
  })

  it('returns to the plain card when the header is removed', async () => {
    const el = await fixture<DcCard>(html`<dc-card><span slot="header">H</span>Body</dc-card>`)
    await new Promise((r) => setTimeout(r))
    await el.updateComplete
    el.querySelector('[slot=header]')!.remove()
    await new Promise((r) => setTimeout(r))
    await el.updateComplete
    expect(el.hasAttribute('has-header')).to.be.false
    expect(getComputedStyle(el).paddingTop).to.equal('16px')
  })

  it('sizes a heading slotted as the header like the header, not like a browser heading', async () => {
    const el = await fixture<DcCard>(html`<dc-card style="--dc-card-header-size: 14px"><h2 slot="header">Open</h2>Body</dc-card>`)
    await new Promise((r) => setTimeout(r))
    await el.updateComplete
    const h2 = el.querySelector('h2')!
    expect(getComputedStyle(h2).fontSize).to.equal('14px')
    expect(getComputedStyle(h2).fontWeight).to.equal('600')
  })

  it('is accessible with header and footer', async () => {
    const el = await fixture<DcCard>(html`<dc-card><span slot="header">H</span>Body<button slot="footer">Save</button></dc-card>`)
    await expect(el).to.be.accessible()
  })
})
