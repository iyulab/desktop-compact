import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-dialog.js'
import type { DcDialog } from './dc-dialog.js'

describe('dc-dialog', () => {
  it('is closed by default', async () => {
    const el = await fixture<DcDialog>(html`<dc-dialog>Content</dc-dialog>`)
    expect(el.open).to.be.false
    const inner = el.shadowRoot!.querySelector('dialog')!
    expect(inner.open).to.be.false
  })

  it('opens the internal dialog as a modal when open becomes true', async () => {
    const el = await fixture<DcDialog>(html`<dc-dialog>Content</dc-dialog>`)
    el.open = true
    await el.updateComplete
    const inner = el.shadowRoot!.querySelector('dialog')!
    expect(inner.open).to.be.true
  })

  it('renders slotted content', async () => {
    const el = await fixture<DcDialog>(html`<dc-dialog>Hello</dc-dialog>`)
    el.open = true
    await el.updateComplete
    expect(el.textContent?.trim()).to.equal('Hello')
  })

  it('closes and fires a close event when the backdrop is clicked', async () => {
    const el = await fixture<DcDialog>(html`<dc-dialog>Content</dc-dialog>`)
    el.open = true
    await el.updateComplete
    const inner = el.shadowRoot!.querySelector('dialog')!
    const listener = oneEvent(el, 'close')
    inner.dispatchEvent(new MouseEvent('click'))
    await listener
    expect(el.open).to.be.false
  })

  it('sets open to false when the native dialog closes for any reason', async () => {
    // Exercises the MutationObserver fallback path directly (see dc-dialog.ts firstUpdated()):
    // calling close() on the internal element the way an external ESC-key close would, bypassing
    // this component's own _handleClick.
    const el = await fixture<DcDialog>(html`<dc-dialog>Content</dc-dialog>`)
    el.open = true
    await el.updateComplete
    const inner = el.shadowRoot!.querySelector('dialog')!
    const listener = oneEvent(el, 'close')
    inner.close()
    await listener
    expect(el.open).to.be.false
  })

  it('forwards a host aria-label onto the internal dialog', async () => {
    const el = await fixture<DcDialog>(html`<dc-dialog aria-label="Settings">Content</dc-dialog>`)
    const inner = el.shadowRoot!.querySelector('dialog')!
    expect(inner.getAttribute('aria-label')).to.equal('Settings')
  })
})
