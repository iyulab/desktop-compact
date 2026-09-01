import { fixture, html, expect } from '@open-wc/testing'
import './dc-textarea.js'
import type { DcTextarea } from './dc-textarea.js'

describe('dc-textarea', () => {
  it('defaults to 3 rows and an empty value', async () => {
    const el = await fixture<DcTextarea>(html`<dc-textarea></dc-textarea>`)
    expect(el.rows).to.equal(3)
    expect(el.value).to.equal('')
  })

  it('updates value as the user types', async () => {
    const el = await fixture<DcTextarea>(html`<dc-textarea></dc-textarea>`)
    const inner = el.shadowRoot!.querySelector('textarea')!
    inner.value = 'multi\nline'
    inner.dispatchEvent(new Event('input', { bubbles: true }))
    expect(el.value).to.equal('multi\nline')
  })

  it('participates in FormData under its name', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><dc-textarea name="notes" value="hi"></dc-textarea></form>`,
    )
    const el = form.querySelector('dc-textarea') as DcTextarea
    await el.updateComplete
    expect(new FormData(form).get('notes')).to.equal('hi')
  })

  it('is invalid when required and empty, and exposes :state(invalid)', async () => {
    const el = await fixture<DcTextarea>(html`<dc-textarea required></dc-textarea>`)
    await el.updateComplete
    expect(el.checkValidity()).to.be.false
    expect(el.matches(':state(invalid)')).to.be.true
  })

  it('resets its value when the owning form resets', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><dc-textarea></dc-textarea></form>`)
    const el = form.querySelector('dc-textarea') as DcTextarea
    el.value = 'typed'
    await el.updateComplete
    form.reset()
    expect(el.value).to.equal('')
  })

  it('is accessible', async () => {
    const el = await fixture<DcTextarea>(html`<dc-textarea placeholder="Notes"></dc-textarea>`)
    await expect(el).to.be.accessible()
  })

  it('forwards a host aria-label onto the internal textarea', async () => {
    const el = await fixture<DcTextarea>(html`<dc-textarea aria-label="Notes"></dc-textarea>`)
    const inner = el.shadowRoot!.querySelector('textarea')!
    expect(inner.getAttribute('aria-label')).to.equal('Notes')
  })
})
