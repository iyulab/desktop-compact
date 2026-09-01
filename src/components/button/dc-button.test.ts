import { fixture, html, expect } from '@open-wc/testing'
import './dc-button.js'
import type { DcButton } from './dc-button.js'

describe('dc-button', () => {
  it('renders slotted content', async () => {
    const el = await fixture<DcButton>(html`<dc-button>Save</dc-button>`)
    expect(el.textContent?.trim()).to.equal('Save')
  })

  it('defaults to type=button and variant=secondary', async () => {
    const el = await fixture<DcButton>(html`<dc-button>Save</dc-button>`)
    expect(el.type).to.equal('button')
    expect(el.variant).to.equal('secondary')
  })

  it('does not submit the owning form when type=button', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><dc-button>Save</dc-button></form>`)
    let submitted = false
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted = true
    })
    const button = form.querySelector('dc-button') as DcButton
    const inner = button.shadowRoot!.querySelector('button')!
    inner.click()
    expect(submitted).to.be.false
  })

  it('submits the owning form when type=submit', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><dc-button type="submit">Save</dc-button></form>`)
    let submitted = false
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted = true
    })
    const button = form.querySelector('dc-button') as DcButton
    const inner = button.shadowRoot!.querySelector('button')!
    inner.click()
    expect(submitted).to.be.true
  })

  it('resets the owning form when type=reset', async () => {
    const form = await fixture<HTMLFormElement>(html`<form>
      <input name="q" value="original" />
      <dc-button type="reset">Reset</dc-button>
    </form>`)
    const input = form.querySelector('input')!
    input.value = 'changed'
    const button = form.querySelector('dc-button') as DcButton
    const inner = button.shadowRoot!.querySelector('button')!
    inner.click()
    expect(input.value).to.equal('original')
  })

  it('does not fire the click handler logic when disabled', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><dc-button type="submit" disabled>Save</dc-button></form>`,
    )
    let submitted = false
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted = true
    })
    const button = form.querySelector('dc-button') as DcButton
    const inner = button.shadowRoot!.querySelector('button')!
    inner.click()
    expect(submitted).to.be.false
  })

  it('is accessible', async () => {
    const el = await fixture<DcButton>(html`<dc-button>Save</dc-button>`)
    await expect(el).to.be.accessible()
  })
})
