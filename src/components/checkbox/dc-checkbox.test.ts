import { fixture, html, expect } from '@open-wc/testing'
import './dc-checkbox.js'
import type { DcCheckbox } from './dc-checkbox.js'
import { formFixture } from '../../../test/form-fixture.js'

const inner = (el: DcCheckbox) => el.shadowRoot!.querySelector('input')!

describe('dc-checkbox', () => {
  it('starts unchecked', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Label</dc-checkbox>`)
    expect(el.checked).to.be.false
    expect(inner(el).checked).to.be.false
  })

  it('toggles on a click on its label, and says so with a change event from the host', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Label</dc-checkbox>`)
    let changes = 0
    el.addEventListener('change', () => changes++)
    el.shadowRoot!.querySelector('label')!.click()
    await el.updateComplete
    expect(el.checked).to.be.true
    expect(changes).to.equal(1)
  })

  it('lets its change event cross the shadow boundary', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Label</dc-checkbox>`)
    let seen = false
    el.parentElement!.addEventListener('change', () => (seen = true))
    inner(el).click()
    expect(seen).to.be.true
  })

  it('toggles on click() called on the element itself, as a native checkbox does', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Label</dc-checkbox>`)
    let changes = 0
    el.addEventListener('change', () => changes++)
    el.click()
    await el.updateComplete
    expect(el.checked).to.be.true
    expect(changes).to.equal(1)
  })

  it('does not toggle on click() while disabled', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox disabled>Label</dc-checkbox>`)
    el.click()
    await el.updateComplete
    expect(el.checked).to.be.false
  })

  it('does not fire change when the property is set by code', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Label</dc-checkbox>`)
    let changes = 0
    el.addEventListener('change', () => changes++)
    el.checked = true
    await el.updateComplete
    expect(inner(el).checked).to.be.true
    expect(changes).to.equal(0)
  })

  it('hands focus to the native checkbox, which owns the Space key', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Label</dc-checkbox>`)
    el.focus()
    expect(el.shadowRoot!.activeElement).to.equal(inner(el))
  })

  it('shows indeterminate until toggled', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox .indeterminate=${true}>Label</dc-checkbox>`)
    expect(inner(el).indeterminate).to.be.true
    inner(el).click()
    await el.updateComplete
    expect(el.indeterminate).to.be.false
    expect(inner(el).indeterminate).to.be.false
  })

  it('does not toggle while disabled', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox disabled>Label</dc-checkbox>`)
    el.shadowRoot!.querySelector('label')!.click()
    await el.updateComplete
    expect(el.checked).to.be.false
  })

  it('submits its value under its name only while checked', async () => {
    const form = await formFixture<HTMLFormElement>(
      html`<form>
        <dc-checkbox name="member" value="a"></dc-checkbox>
        <dc-checkbox name="member" value="b" checked></dc-checkbox>
      </form>`,
    )
    const boxes = [...form.querySelectorAll('dc-checkbox')] as DcCheckbox[]
    await Promise.all(boxes.map((b) => b.updateComplete))
    expect(new FormData(form).getAll('member')).to.deep.equal(['b'])
  })

  it('is invalid when required and unchecked', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox required>Label</dc-checkbox>`)
    await el.updateComplete
    expect(el.checkValidity()).to.be.false
    expect(el.matches(':state(invalid)')).to.be.true
    el.checked = true
    await el.updateComplete
    expect(el.checkValidity()).to.be.true
    expect(el.matches(':state(invalid)')).to.be.false
  })

  it('returns to its checked attribute when the owning form resets', async () => {
    const form = await formFixture<HTMLFormElement>(html`<form><dc-checkbox checked></dc-checkbox></form>`)
    const el = form.querySelector('dc-checkbox') as DcCheckbox
    await el.updateComplete
    el.checked = false
    await el.updateComplete
    form.reset()
    expect(el.checked).to.be.true
  })

  it('is accessible, named by its slotted label', async () => {
    const el = await fixture<DcCheckbox>(html`<dc-checkbox>Include archived items</dc-checkbox>`)
    await expect(el).to.be.accessible()
  })
})
