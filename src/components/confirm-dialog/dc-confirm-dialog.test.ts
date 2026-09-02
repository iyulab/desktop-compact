import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-confirm-dialog.js'
import type { DcConfirmDialog } from './dc-confirm-dialog.js'

describe('dc-confirm-dialog', () => {
  it('is closed by default', async () => {
    const el = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog></dc-confirm-dialog>`)
    expect(el.open).to.be.false
  })

  it('renders the heading and message content', async () => {
    const el = await fixture<DcConfirmDialog>(
      html`<dc-confirm-dialog heading="Delete item?" open>Are you sure?</dc-confirm-dialog>`,
    )
    await el.updateComplete
    const heading = el.shadowRoot!.querySelector('[part="heading"]')!
    expect(heading.textContent?.trim()).to.equal('Delete item?')
    expect(el.textContent?.trim()).to.equal('Are you sure?')
  })

  it('defaults confirmLabel/cancelLabel to empty — no baked-in text (no-i18n)', async () => {
    const el = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog open></dc-confirm-dialog>`)
    await el.updateComplete
    expect(el.confirmLabel).to.equal('')
    expect(el.cancelLabel).to.equal('')
    const buttons = el.shadowRoot!.querySelectorAll('dc-button')
    expect(buttons[0].textContent?.trim()).to.equal('')
    expect(buttons[1].textContent?.trim()).to.equal('')
  })

  it('renders consumer-supplied confirmLabel/cancelLabel on the buttons', async () => {
    const el = await fixture<DcConfirmDialog>(
      html`<dc-confirm-dialog open confirm-label="Delete" cancel-label="Keep"></dc-confirm-dialog>`,
    )
    await el.updateComplete
    const buttons = el.shadowRoot!.querySelectorAll('dc-button')
    expect(buttons[0].textContent?.trim()).to.equal('Keep')
    expect(buttons[1].textContent?.trim()).to.equal('Delete')
  })

  it('omits aria-label on the inner dialog when no heading is given — no baked-in fallback text', async () => {
    const el = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog open></dc-confirm-dialog>`)
    await el.updateComplete
    const inner = el.shadowRoot!.querySelector('dc-dialog')!
    expect(inner.hasAttribute('aria-label')).to.be.false
  })

  it('forwards heading as aria-label on the inner dialog when given', async () => {
    const el = await fixture<DcConfirmDialog>(
      html`<dc-confirm-dialog open heading="Delete item?"></dc-confirm-dialog>`,
    )
    await el.updateComplete
    const inner = el.shadowRoot!.querySelector('dc-dialog')!
    expect(inner.getAttribute('aria-label')).to.equal('Delete item?')
  })

  it('dispatches confirm and closes when the confirm button is clicked', async () => {
    const el = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog open></dc-confirm-dialog>`)
    await el.updateComplete
    const confirmButton = el.shadowRoot!.querySelectorAll('dc-button')[1]
    const inner = confirmButton.shadowRoot!.querySelector('button')!
    const listener = oneEvent(el, 'confirm')
    inner.click()
    await listener
    expect(el.open).to.be.false
  })

  it('dispatches cancel and closes when the cancel button is clicked', async () => {
    const el = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog open></dc-confirm-dialog>`)
    await el.updateComplete
    const cancelButton = el.shadowRoot!.querySelectorAll('dc-button')[0]
    const inner = cancelButton.shadowRoot!.querySelector('button')!
    const listener = oneEvent(el, 'cancel')
    inner.click()
    await listener
    expect(el.open).to.be.false
  })

  it('renders the confirm button with variant=danger when danger is set', async () => {
    const el = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog open danger></dc-confirm-dialog>`)
    await el.updateComplete
    const confirmButton = el.shadowRoot!.querySelectorAll('dc-button')[1]
    expect(confirmButton.getAttribute('variant')).to.equal('danger')
  })
})
