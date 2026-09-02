import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-toast.js'
import type { DcToast } from './dc-toast.js'

describe('dc-toast', () => {
  it('defaults to variant=info and an empty message — no baked-in text', async () => {
    const el = await fixture<DcToast>(html`<dc-toast></dc-toast>`)
    expect(el.variant).to.equal('info')
    expect(el.message).to.equal('')
    expect(el.actionLabel).to.equal('')
    expect(el.dismissLabel).to.equal('')
  })

  it('reflects the variant attribute', async () => {
    const el = await fixture<DcToast>(html`<dc-toast variant="error"></dc-toast>`)
    expect(el.getAttribute('variant')).to.equal('error')
  })

  it('renders the consumer-supplied message', async () => {
    const el = await fixture<DcToast>(html`<dc-toast message="Saved successfully"></dc-toast>`)
    expect(el.shadowRoot!.querySelector('[part="message"]')?.textContent?.trim()).to.equal(
      'Saved successfully',
    )
  })

  it('uses role=status for info/success (polite, non-urgent)', async () => {
    const el = await fixture<DcToast>(html`<dc-toast variant="success"></dc-toast>`)
    expect(el.shadowRoot!.querySelector('[role="status"]')).to.exist
    expect(el.shadowRoot!.querySelector('[role="alert"]')).to.not.exist
  })

  it('uses role=alert for warning/error (assertive, urgent)', async () => {
    const el = await fixture<DcToast>(html`<dc-toast variant="error"></dc-toast>`)
    expect(el.shadowRoot!.querySelector('[role="alert"]')).to.exist
    expect(el.shadowRoot!.querySelector('[role="status"]')).to.not.exist
  })

  it('renders no action button when actionLabel is empty', async () => {
    const el = await fixture<DcToast>(html`<dc-toast message="Done"></dc-toast>`)
    expect(el.shadowRoot!.querySelector('[part="action"]')).to.not.exist
  })

  it('renders an action button and dispatches action when clicked', async () => {
    const el = await fixture<DcToast>(
      html`<dc-toast message="File deleted" action-label="Undo"></dc-toast>`,
    )
    const actionButton = el.shadowRoot!.querySelector('[part="action"]')!
    expect(actionButton.textContent?.trim()).to.equal('Undo')
    const inner = actionButton.shadowRoot!.querySelector('button')!
    const listener = oneEvent(el, 'action')
    inner.click()
    await listener
  })

  it('dispatches dismiss when the close button is clicked', async () => {
    const el = await fixture<DcToast>(
      html`<dc-toast message="Saved" dismiss-label="Dismiss"></dc-toast>`,
    )
    const dismissButton = el.shadowRoot!.querySelector('[part="dismiss"]')!
    const inner = dismissButton.shadowRoot!.querySelector('button')!
    const listener = oneEvent(el, 'dismiss')
    inner.click()
    await listener
  })

  it('does not remove itself from the DOM on dismiss — display-only, consumer controls lifecycle', async () => {
    const el = await fixture<DcToast>(
      html`<dc-toast message="Saved" dismiss-label="Dismiss"></dc-toast>`,
    )
    const dismissButton = el.shadowRoot!.querySelector('[part="dismiss"]')!
    const inner = dismissButton.shadowRoot!.querySelector('button')!
    const listener = oneEvent(el, 'dismiss')
    inner.click()
    await listener
    expect(el.isConnected).to.be.true
  })

  it('forwards dismissLabel as the dismiss button aria-label', async () => {
    const el = await fixture<DcToast>(
      html`<dc-toast message="Saved" dismiss-label="Close notification"></dc-toast>`,
    )
    const dismissButton = el.shadowRoot!.querySelector('[part="dismiss"]')!
    const inner = dismissButton.shadowRoot!.querySelector('button')!
    expect(inner.getAttribute('aria-label')).to.equal('Close notification')
  })

  it('is accessible', async () => {
    const el = await fixture<DcToast>(
      html`<dc-toast
        variant="success"
        message="Saved successfully"
        action-label="Undo"
        dismiss-label="Dismiss"
      ></dc-toast>`,
    )
    await expect(el).to.be.accessible()
  })
})
