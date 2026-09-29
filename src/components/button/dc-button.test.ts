import { fixture, html, expect } from '@open-wc/testing'
import './dc-button.js'
import type { DcButton } from './dc-button.js'
import { formFixture } from '../../../test/form-fixture.js'

describe('dc-button', () => {
  it('renders slotted content', async () => {
    const el = await fixture<DcButton>(html`<dc-button>Save</dc-button>`)
    expect(el.textContent?.trim()).to.equal('Save')
  })

  it('defaults to type=button, variant=secondary, size=md', async () => {
    const el = await fixture<DcButton>(html`<dc-button>Save</dc-button>`)
    expect(el.type).to.equal('button')
    expect(el.variant).to.equal('secondary')
    expect(el.size).to.equal('md')
  })

  it('reflects variant=outline and size=sm as attributes', async () => {
    const el = await fixture<DcButton>(html`<dc-button variant="outline" size="sm">Save</dc-button>`)
    expect(el.getAttribute('variant')).to.equal('outline')
    expect(el.getAttribute('size')).to.equal('sm')
  })

  it('does not submit the owning form when type=button', async () => {
    const form = await formFixture<HTMLFormElement>(html`<form><dc-button>Save</dc-button></form>`)
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
    const form = await formFixture<HTMLFormElement>(html`<form><dc-button type="submit">Save</dc-button></form>`)
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
    const form = await formFixture<HTMLFormElement>(html`<form>
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
    const form = await formFixture<HTMLFormElement>(
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

  it('forwards a popup trigger aria-haspopup and aria-expanded to the inner button, and follows changes', async () => {
    const el = await fixture<DcButton>(html`<dc-button aria-haspopup="menu" aria-expanded="false">Import</dc-button>`)
    const inner = el.shadowRoot!.querySelector('button')!
    expect(inner.getAttribute('aria-haspopup')).to.equal('menu')
    expect(inner.getAttribute('aria-expanded')).to.equal('false')
    el.setAttribute('aria-expanded', 'true')
    await el.updateComplete
    expect(inner.getAttribute('aria-expanded')).to.equal('true')
    el.removeAttribute('aria-haspopup')
    await el.updateComplete
    expect(inner.hasAttribute('aria-haspopup')).to.equal(false)
  })

  it('forwards a toggle aria-pressed to the inner button', async () => {
    const el = await fixture<DcButton>(html`<dc-button aria-pressed="true">Bold</dc-button>`)
    const inner = el.shadowRoot!.querySelector('button')!
    expect(inner.getAttribute('aria-pressed')).to.equal('true')
    el.setAttribute('aria-pressed', 'false')
    await el.updateComplete
    expect(inner.getAttribute('aria-pressed')).to.equal('false')
  })

  it('leaves the inner button without them when the host has none', async () => {
    const el = await fixture<DcButton>(html`<dc-button>Save</dc-button>`)
    const inner = el.shadowRoot!.querySelector('button')!
    expect(inner.hasAttribute('aria-haspopup')).to.equal(false)
    expect(inner.hasAttribute('aria-expanded')).to.equal(false)
    expect(inner.hasAttribute('aria-pressed')).to.equal(false)
  })

  it('forwards host aria-label to the inner button — required for icon-only buttons with no visible text', async () => {
    const el = await fixture<DcButton>(html`<dc-button aria-label="Close">&times;</dc-button>`)
    const inner = el.shadowRoot!.querySelector('button')!
    expect(inner.getAttribute('aria-label')).to.equal('Close')
  })

  it('paints an outline label with the accent text colour when the host supplies one', async () => {
    // The accent is a fill. As a label on the page ground it measured 2.05-3.60:1
    // in three consumer themes; --dc-color-accent-text is the shade chosen to read.
    const el = await fixture<DcButton>(
      html`<dc-button variant="outline" style="--dc-color-accent: rgb(245, 158, 11); --dc-color-accent-text: rgb(180, 83, 9)">Go</dc-button>`,
    )
    const inner = el.shadowRoot!.querySelector('button')!
    expect(getComputedStyle(inner).color).to.equal('rgb(180, 83, 9)')
    expect(getComputedStyle(inner).borderTopColor).to.equal('rgb(245, 158, 11)')
  })

  it('falls back to the accent for an outline label when no text colour is supplied', async () => {
    const el = await fixture<DcButton>(
      html`<dc-button variant="outline" style="--dc-color-accent: rgb(245, 158, 11)">Go</dc-button>`,
    )
    expect(getComputedStyle(el.shadowRoot!.querySelector('button')!).color).to.equal('rgb(245, 158, 11)')
  })
})
