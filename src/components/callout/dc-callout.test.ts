import { fixture, html, expect } from '@open-wc/testing'
import './dc-callout.js'
import type { DcCallout } from './dc-callout.js'

describe('dc-callout', () => {
  it('defaults to info: the secondary subtle ground and a secondary edge', async () => {
    const el = await fixture<DcCallout>(html`<dc-callout style="--dc-color-secondary-subtle: rgb(1, 1, 1); --dc-color-secondary: rgb(2, 2, 2)"><p>Hi</p></dc-callout>`)
    expect(el.variant).to.equal('info')
    const s = getComputedStyle(el)
    expect(s.backgroundColor).to.equal('rgb(1, 1, 1)')
    expect(s.borderLeftColor).to.equal('rgb(2, 2, 2)')
  })

  it('takes the danger ground and edge', async () => {
    const el = await fixture<DcCallout>(html`<dc-callout variant="danger" style="--dc-color-danger-subtle: rgb(3, 3, 3); --dc-color-danger: rgb(4, 4, 4)"><p>No</p></dc-callout>`)
    expect(getComputedStyle(el).backgroundColor).to.equal('rgb(3, 3, 3)')
    expect(getComputedStyle(el).borderLeftColor).to.equal('rgb(4, 4, 4)')
  })

  it('keeps the consumer content and role as given (an alert reads its paragraphs)', async () => {
    const el = await fixture<DcCallout>(html`<dc-callout variant="danger" role="alert"><p>Could not open</p><p>Detail</p></dc-callout>`)
    expect(el.getAttribute('role')).to.equal('alert')
    expect([...el.querySelectorAll('p')].map((p) => p.textContent)).to.deep.equal(['Could not open', 'Detail'])
  })

  it('puts actions at the end', async () => {
    const el = await fixture<DcCallout>(html`<dc-callout><p>Pick one</p><button slot="actions">Pick</button></dc-callout>`)
    const slot = el.shadowRoot!.querySelector('slot[name=actions]') as HTMLSlotElement
    expect(slot.assignedElements()[0].textContent).to.equal('Pick')
  })

  it('is accessible', async () => {
    const el = await fixture<DcCallout>(html`<dc-callout variant="warning"><p>Check this</p><button slot="actions">Check</button></dc-callout>`)
    await expect(el).to.be.accessible()
  })
})
