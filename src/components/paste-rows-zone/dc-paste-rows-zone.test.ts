import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-paste-rows-zone.js'
import type { DcPasteRowsZone } from './dc-paste-rows-zone.js'

function pasteText(el: HTMLElement, text: string): void {
  const dt = new DataTransfer()
  dt.setData('text/plain', text)
  const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt })
  el.dispatchEvent(event)
}

describe('dc-paste-rows-zone', () => {
  it('defaults placeholder to empty — no baked-in text', async () => {
    const el = await fixture<DcPasteRowsZone>(html`<dc-paste-rows-zone></dc-paste-rows-zone>`)
    expect(el.placeholder).to.equal('')
  })

  it('renders a single-row textarea with the consumer-supplied placeholder', async () => {
    const el = await fixture<DcPasteRowsZone>(
      html`<dc-paste-rows-zone placeholder="Paste rows here"></dc-paste-rows-zone>`,
    )
    const inner = el.shadowRoot!.querySelector('textarea')!
    expect(inner.rows).to.equal(1)
    expect(inner.placeholder).to.equal('Paste rows here')
  })

  it('dispatches rows with the parsed matrix on paste', async () => {
    const el = await fixture<DcPasteRowsZone>(html`<dc-paste-rows-zone></dc-paste-rows-zone>`)
    const inner = el.shadowRoot!.querySelector('textarea')!
    const listener = oneEvent(el, 'rows')
    pasteText(inner, 'a\tb\nc\td')
    const event = await listener
    expect(event.detail.rows).to.deep.equal([
      ['a', 'b'],
      ['c', 'd'],
    ])
    expect(event.detail.skippedEmpty).to.equal(0)
  })

  it('does not dispatch rows when the pasted content is entirely blank', async () => {
    const el = await fixture<DcPasteRowsZone>(html`<dc-paste-rows-zone></dc-paste-rows-zone>`)
    const inner = el.shadowRoot!.querySelector('textarea')!
    let fired = false
    el.addEventListener('rows', () => {
      fired = true
    })
    pasteText(inner, '   \n\t\n')
    await el.updateComplete
    expect(fired).to.be.false
  })

  it('keeps the textarea value empty after a paste (paste-only, not editable)', async () => {
    const el = await fixture<DcPasteRowsZone>(html`<dc-paste-rows-zone></dc-paste-rows-zone>`)
    const inner = el.shadowRoot!.querySelector('textarea')!
    pasteText(inner, 'a\tb')
    await el.updateComplete
    expect(inner.value).to.equal('')
  })

  it('resets typed input back to empty (paste-only, not editable)', async () => {
    const el = await fixture<DcPasteRowsZone>(html`<dc-paste-rows-zone></dc-paste-rows-zone>`)
    const inner = el.shadowRoot!.querySelector('textarea')!
    inner.value = 'typed text'
    inner.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete
    expect(inner.value).to.equal('')
  })

  it('is accessible', async () => {
    const el = await fixture<DcPasteRowsZone>(
      html`<dc-paste-rows-zone placeholder="Paste rows here"></dc-paste-rows-zone>`,
    )
    await expect(el).to.be.accessible()
  })
})
