import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import { isModalOpen, setModalOpen } from './modal.js'
import '../components/dialog/dc-dialog.js'
import '../components/confirm-dialog/dc-confirm-dialog.js'
import type { DcDialog } from '../components/dialog/dc-dialog.js'
import type { DcConfirmDialog } from '../components/confirm-dialog/dc-confirm-dialog.js'

describe('isModalOpen', () => {
  it('is open while a dialog is, and says when that changes', async () => {
    const el = await fixture<DcDialog>(html`<dc-dialog>Content</dc-dialog>`)
    expect(isModalOpen()).to.be.false
    const opened = oneEvent(document, 'dc-modal-change')
    el.open = true
    await el.updateComplete
    expect((await opened).detail).to.deep.equal({ open: true })
    expect(isModalOpen()).to.be.true

    // Closed for any reason — here the native dialog, as Escape would.
    const closed = oneEvent(document, 'dc-modal-change')
    el.shadowRoot!.querySelector('dialog')!.close()
    expect((await closed).detail).to.deep.equal({ open: false })
    expect(isModalOpen()).to.be.false
  })

  it('stays open until the last of two dialogs closes, and forgets a dialog taken away', async () => {
    const a = await fixture<DcDialog>(html`<dc-dialog>A</dc-dialog>`)
    const b = await fixture<DcConfirmDialog>(html`<dc-confirm-dialog message="Sure?"></dc-confirm-dialog>`)
    a.open = true
    b.open = true
    await a.updateComplete
    await b.updateComplete
    a.open = false
    await a.updateComplete
    expect(isModalOpen()).to.be.true
    b.remove()
    await new Promise((r) => setTimeout(r))
    expect(isModalOpen()).to.be.false
  })

  it('counts what else says it is a modal', () => {
    const overlay = {}
    setModalOpen(overlay, true)
    setModalOpen(overlay, true)
    expect(isModalOpen()).to.be.true
    setModalOpen(overlay, false)
    expect(isModalOpen()).to.be.false
  })
})
