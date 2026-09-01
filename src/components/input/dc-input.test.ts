import { fixture, html, expect } from '@open-wc/testing'
import './dc-input.js'
import type { DcInput } from './dc-input.js'

describe('dc-input', () => {
  it('defaults to type=text and an empty value', async () => {
    const el = await fixture<DcInput>(html`<dc-input></dc-input>`)
    expect(el.type).to.equal('text')
    expect(el.value).to.equal('')
  })

  it('updates value as the user types', async () => {
    const el = await fixture<DcInput>(html`<dc-input></dc-input>`)
    const inner = el.shadowRoot!.querySelector('input')!
    inner.value = 'hello'
    inner.dispatchEvent(new Event('input', { bubbles: true }))
    expect(el.value).to.equal('hello')
  })

  it('participates in FormData under its name', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><dc-input name="email" value="a@b.com"></dc-input></form>`,
    )
    const el = form.querySelector('dc-input') as DcInput
    await el.updateComplete
    expect(new FormData(form).get('email')).to.equal('a@b.com')
  })

  it('is invalid when required and empty, and exposes :state(invalid)', async () => {
    const el = await fixture<DcInput>(html`<dc-input required></dc-input>`)
    await el.updateComplete
    expect(el.checkValidity()).to.be.false
    expect(el.matches(':state(invalid)')).to.be.true
  })

  it('becomes valid once a required field is filled', async () => {
    const el = await fixture<DcInput>(html`<dc-input required></dc-input>`)
    const inner = el.shadowRoot!.querySelector('input')!
    inner.value = 'hello'
    inner.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete
    expect(el.checkValidity()).to.be.true
    expect(el.matches(':state(invalid)')).to.be.false
  })

  it('resets its value when the owning form resets', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><dc-input></dc-input></form>`)
    const el = form.querySelector('dc-input') as DcInput
    el.value = 'typed'
    await el.updateComplete
    form.reset()
    expect(el.value).to.equal('')
  })

  it('is accessible', async () => {
    const el = await fixture<DcInput>(html`<dc-input placeholder="Email"></dc-input>`)
    await expect(el).to.be.accessible()
  })

  it('forwards a host aria-label onto the internal input', async () => {
    const el = await fixture<DcInput>(html`<dc-input aria-label="Email"></dc-input>`)
    const inner = el.shadowRoot!.querySelector('input')!
    expect(inner.getAttribute('aria-label')).to.equal('Email')
  })
})
