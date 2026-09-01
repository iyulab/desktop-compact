import { fixture, html, expect } from '@open-wc/testing'
import './dc-status-strip.js'
import type { DcStatusStrip } from './dc-status-strip.js'

describe('dc-status-strip', () => {
  it('defaults to status=idle and an empty label', async () => {
    const el = await fixture<DcStatusStrip>(html`<dc-status-strip></dc-status-strip>`)
    expect(el.status).to.equal('idle')
    expect(el.label).to.equal('')
  })

  it('reflects the status attribute', async () => {
    const el = await fixture<DcStatusStrip>(html`<dc-status-strip status="error"></dc-status-strip>`)
    expect(el.getAttribute('status')).to.equal('error')
  })

  it('renders a dc-spinner when status=loading', async () => {
    const el = await fixture<DcStatusStrip>(html`<dc-status-strip status="loading"></dc-status-strip>`)
    expect(el.shadowRoot!.querySelector('dc-spinner')).to.exist
    expect(el.shadowRoot!.querySelector('.dot')).to.not.exist
  })

  it('renders a status dot (not a spinner) for idle/error/done', async () => {
    const el = await fixture<DcStatusStrip>(html`<dc-status-strip status="done"></dc-status-strip>`)
    expect(el.shadowRoot!.querySelector('.dot')).to.exist
    expect(el.shadowRoot!.querySelector('dc-spinner')).to.not.exist
  })

  it('renders the label when given', async () => {
    const el = await fixture<DcStatusStrip>(
      html`<dc-status-strip status="done" label="Saved"></dc-status-strip>`,
    )
    expect(el.shadowRoot!.querySelector('[part="label"]')?.textContent?.trim()).to.equal('Saved')
  })

  it('renders no label element when label is empty', async () => {
    const el = await fixture<DcStatusStrip>(html`<dc-status-strip status="done"></dc-status-strip>`)
    expect(el.shadowRoot!.querySelector('[part="label"]')).to.not.exist
  })

  it('exposes role=status for live-region announcement', async () => {
    const el = await fixture<DcStatusStrip>(html`<dc-status-strip label="Ready"></dc-status-strip>`)
    expect(el.shadowRoot!.querySelector('[role="status"]')).to.exist
  })

  it('is accessible', async () => {
    const el = await fixture<DcStatusStrip>(
      html`<dc-status-strip status="loading" label="Saving…"></dc-status-strip>`,
    )
    await expect(el).to.be.accessible()
  })
})
