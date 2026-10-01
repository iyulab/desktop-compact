import { fixture, html, expect, elementUpdated } from '@open-wc/testing'
import './dc-empty-state.js'
import type { DcEmptyState } from './dc-empty-state.js'

describe('dc-empty-state', () => {
  it('renders the heading', async () => {
    const el = await fixture<DcEmptyState>(
      html`<dc-empty-state heading="No projects yet"></dc-empty-state>`
    )
    expect(el.shadowRoot!.querySelector('h2')!.textContent).to.equal('No projects yet')
  })

  it('hides the icon wrapper when no icon is slotted', async () => {
    const el = await fixture<DcEmptyState>(html`<dc-empty-state heading="No projects"></dc-empty-state>`)
    const icon = el.shadowRoot!.querySelector('.icon')!
    expect(icon.hasAttribute('hidden')).to.be.true
  })

  it('shows the icon wrapper when an icon is slotted', async () => {
    const el = await fixture<DcEmptyState>(
      html`<dc-empty-state heading="No projects"><span slot="icon">📁</span></dc-empty-state>`
    )
    await elementUpdated(el)
    const icon = el.shadowRoot!.querySelector('.icon')!
    expect(icon.hasAttribute('hidden')).to.be.false
  })

  it('omits the description paragraph when none is given', async () => {
    const el = await fixture<DcEmptyState>(html`<dc-empty-state heading="No projects"></dc-empty-state>`)
    expect(el.shadowRoot!.querySelector('p')).to.be.null
  })

  it('renders the description when given', async () => {
    const el = await fixture<DcEmptyState>(
      html`<dc-empty-state heading="No projects" description="Create your first project"></dc-empty-state>`
    )
    expect(el.shadowRoot!.querySelector('p')!.textContent).to.equal('Create your first project')
  })

  it('is accessible', async () => {
    const el = await fixture<DcEmptyState>(html`<dc-empty-state heading="No projects"></dc-empty-state>`)
    await expect(el).to.be.accessible()
  })

  it('omits the heading element when no heading is given', async () => {
    const el = await fixture<DcEmptyState>(
      html`<dc-empty-state description="Nothing to show"></dc-empty-state>`
    )
    expect(el.shadowRoot!.querySelector('h2')).to.be.null
  })

  it('adds the heading element when a heading is set later', async () => {
    const el = await fixture<DcEmptyState>(html`<dc-empty-state></dc-empty-state>`)
    expect(el.shadowRoot!.querySelector('h2')).to.be.null
    el.heading = 'No projects'
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('h2')!.textContent).to.equal('No projects')
  })

  it('is accessible without a heading', async () => {
    const el = await fixture<DcEmptyState>(
      html`<dc-empty-state><button slot="actions">Import</button></dc-empty-state>`
    )
    await expect(el).to.be.accessible()
  })
})
