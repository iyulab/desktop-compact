import { fixture, html, expect } from '@open-wc/testing'
import './dc-select.js'
import type { DcSelect } from './dc-select.js'

const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

describe('dc-select', () => {
  it('renders one <option> per entry in options', async () => {
    const el = await fixture<DcSelect>(html`<dc-select .options=${OPTIONS}></dc-select>`)
    const rendered = el.shadowRoot!.querySelectorAll('option')
    expect(rendered.length).to.equal(3)
    expect(rendered[2].disabled).to.be.true
  })

  it('updates value on change and participates in FormData', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><dc-select name="letter" .options=${OPTIONS}></dc-select></form>`,
    )
    const el = form.querySelector('dc-select') as DcSelect
    const inner = el.shadowRoot!.querySelector('select')!
    inner.value = 'b'
    inner.dispatchEvent(new Event('change', { bubbles: true }))
    await el.updateComplete
    expect(el.value).to.equal('b')
    expect(new FormData(form).get('letter')).to.equal('b')
  })

  it('dispatches a bubbling, composed change event on the host when the value changes', async () => {
    const el = await fixture<DcSelect>(html`<dc-select .options=${OPTIONS}></dc-select>`)
    const seen: Event[] = []
    el.addEventListener('change', (e) => seen.push(e))
    const inner = el.shadowRoot!.querySelector('select')!
    inner.value = 'c'
    inner.dispatchEvent(new Event('change', { bubbles: true }))
    expect(seen.length).to.equal(1)
    expect(seen[0].bubbles).to.be.true
    expect(seen[0].composed).to.be.true
  })

  it('renders a disabled placeholder option when value is empty and placeholder is set', async () => {
    const el = await fixture<DcSelect>(
      html`<dc-select .options=${OPTIONS} placeholder="Choose one"></dc-select>`,
    )
    const first = el.shadowRoot!.querySelector('option')!
    expect(first.disabled).to.be.true
    expect(first.textContent?.trim()).to.equal('Choose one')
    expect(first.selected).to.be.true
  })

  it('is invalid when required and no option is selected', async () => {
    const el = await fixture<DcSelect>(
      html`<dc-select .options=${OPTIONS} placeholder="Choose one" required></dc-select>`,
    )
    await el.updateComplete
    expect(el.checkValidity()).to.be.false
    expect(el.matches(':state(invalid)')).to.be.true
  })

  it('resets to empty when the owning form resets', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><dc-select .options=${OPTIONS}></dc-select></form>`,
    )
    const el = form.querySelector('dc-select') as DcSelect
    el.value = 'a'
    await el.updateComplete
    form.reset()
    expect(el.value).to.equal('')
  })

  it('is accessible', async () => {
    const el = await fixture<DcSelect>(
      html`<dc-select .options=${OPTIONS} placeholder="Choose one" aria-label="Status"></dc-select>`,
    )
    await expect(el).to.be.accessible()
  })

  it('forwards a host aria-label onto the internal select', async () => {
    const el = await fixture<DcSelect>(
      html`<dc-select .options=${OPTIONS} aria-label="Status"></dc-select>`,
    )
    const inner = el.shadowRoot!.querySelector('select')!
    expect(inner.getAttribute('aria-label')).to.equal('Status')
  })
})
