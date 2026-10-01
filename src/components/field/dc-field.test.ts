import { fixture, html, expect } from '@open-wc/testing'
import { render } from 'lit'
import './dc-field.js'
import '../input/dc-input.js'
import '../select/dc-select.js'
import '../textarea/dc-textarea.js'
import type { DcField } from './dc-field.js'

describe('dc-field', () => {
  it('shows the label, and a required mark when required', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Date" required><dc-input aria-label="Date"></dc-input></dc-field>`)
    expect(el.shadowRoot!.querySelector('.label')!.textContent!.trim()).to.equal('Date*')
    expect(el.shadowRoot!.querySelector('.required')!.getAttribute('aria-hidden')).to.equal('true')
  })

  it('focuses its control when the label is clicked', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Name"><input aria-label="Name" /></dc-field>`)
    ;(el.shadowRoot!.querySelector('.label') as HTMLElement).click()
    expect(document.activeElement).to.equal(el.querySelector('input'))
  })

  it('focuses a dc-input inside when the label is clicked', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Date"><dc-input aria-label="Date"></dc-input></dc-field>`)
    ;(el.shadowRoot!.querySelector('.label') as HTMLElement).click()
    const input = el.querySelector('dc-input')!
    expect(input.shadowRoot!.activeElement?.tagName).to.equal('INPUT')
  })

  it('focuses a dc-select inside when the label is clicked', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Kind"><dc-select aria-label="Kind"></dc-select></dc-field>`)
    ;(el.shadowRoot!.querySelector('.label') as HTMLElement).click()
    const select = el.querySelector('dc-select')!
    expect(select.shadowRoot!.activeElement?.tagName).to.equal('SELECT')
  })

  it('focuses a dc-textarea inside when the label is clicked', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Note"><dc-textarea aria-label="Note"></dc-textarea></dc-field>`)
    ;(el.shadowRoot!.querySelector('.label') as HTMLElement).click()
    const area = el.querySelector('dc-textarea')!
    expect(area.shadowRoot!.activeElement?.tagName).to.equal('TEXTAREA')
  })

  it('shows the hint, and the error in place of the hint', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Grade" hint="From the client"><input aria-label="Grade" /></dc-field>`)
    expect(el.shadowRoot!.querySelector('.hint')!.textContent).to.equal('From the client')
    el.error = 'Enter a number'
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.hint')).to.equal(null)
    expect(el.shadowRoot!.querySelector('.error')!.textContent).to.equal('Enter a number')
  })

  it('makes the hint, then the error, the native control’s description, and marks it invalid', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Grade" hint="From the client"><input aria-label="Grade" /></dc-field>`)
    const input = el.querySelector('input')!
    expect(input.getAttribute('aria-description')).to.equal('From the client')
    expect(input.hasAttribute('aria-invalid')).to.equal(false)
    el.error = 'Enter a number'
    await el.updateComplete
    expect(input.getAttribute('aria-description')).to.equal('Enter a number')
    expect(input.getAttribute('aria-invalid')).to.equal('true')
    el.error = ''
    el.hint = ''
    await el.updateComplete
    expect(input.hasAttribute('aria-description')).to.equal(false)
    expect(input.hasAttribute('aria-invalid')).to.equal(false)
  })

  it('marks the native control required, unless it already is', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Date" required><input aria-label="Date" /></dc-field>`)
    expect(el.querySelector('input')!.getAttribute('aria-required')).to.equal('true')
    const native = await fixture<DcField>(html`<dc-field label="Date" required><input aria-label="Date" required /></dc-field>`)
    expect(native.querySelector('input')!.hasAttribute('aria-required')).to.equal(false)
  })

  for (const [tag, inner] of [['dc-input', 'input'], ['dc-select', 'select'], ['dc-textarea', 'textarea']] as const) {
    it(`hands the description, invalid and required to the native element inside a ${tag}`, async () => {
      const el = await fixture<DcField>(
        tag === 'dc-input'
          ? html`<dc-field label="A" hint="h" required><dc-input aria-label="A"></dc-input></dc-field>`
          : tag === 'dc-select'
            ? html`<dc-field label="A" hint="h" required><dc-select aria-label="A"></dc-select></dc-field>`
            : html`<dc-field label="A" hint="h" required><dc-textarea aria-label="A"></dc-textarea></dc-field>`,
      )
      const control = el.querySelector(tag) as HTMLElement & { updateComplete: Promise<boolean> }
      await control.updateComplete
      const native = control.shadowRoot!.querySelector(inner)!
      expect(native.getAttribute('aria-description')).to.equal('h')
      expect(native.getAttribute('aria-required')).to.equal('true')
      expect(native.hasAttribute('aria-invalid')).to.equal(false)
      el.error = 'Wrong'
      await el.updateComplete
      await control.updateComplete
      expect(native.getAttribute('aria-description')).to.equal('Wrong')
      expect(native.getAttribute('aria-invalid')).to.equal('true')
      // Nothing of it lands on the host, which has no role to carry it.
      expect(control.hasAttribute('aria-description')).to.equal(false)
    })
  }

  it('describes a control put in after the field was drawn', async () => {
    const el = await fixture<DcField>(html`<dc-field label="A" hint="later"></dc-field>`)
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'A')
    el.append(input)
    await new Promise((resolve) => setTimeout(resolve))
    expect(input.getAttribute('aria-description')).to.equal('later')
  })

  it('spans grid columns when span is set', async () => {
    const grid = document.createElement('div')
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr)'
    document.body.appendChild(grid)
    try {
      render(
        html`<dc-field label="Note" span="2"><input aria-label="Note" /></dc-field>
          <dc-field label="Other"><input aria-label="Other" /></dc-field>
          <dc-field label="Zero" span="0"><input aria-label="Zero" /></dc-field>`,
        grid
      )
      const [note, other, zero] = Array.from(grid.querySelectorAll('dc-field'))
      await Promise.all([note, other, zero].map((f) => f.updateComplete))
      expect(getComputedStyle(note).gridColumnEnd).to.equal('span 2')
      expect(getComputedStyle(other).gridColumnEnd).to.equal('auto')
      expect(getComputedStyle(zero).gridColumnEnd).to.equal('auto')
    } finally {
      grid.remove()
    }
  })

  it('reads the field role tokens', async () => {
    const el = await fixture<DcField>(html`<dc-field label="A" hint="h" style="--dc-field-label-color: rgb(1, 2, 3); --dc-field-hint-color: rgb(4, 5, 6)"><input aria-label="A" /></dc-field>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('.label')!).color).to.equal('rgb(1, 2, 3)')
    expect(getComputedStyle(el.shadowRoot!.querySelector('.hint')!).color).to.equal('rgb(4, 5, 6)')
  })

  it('is accessible', async () => {
    const el = await fixture<DcField>(html`<dc-field label="Date" hint="Calendar date" required><input aria-label="Date" /></dc-field>`)
    await expect(el).to.be.accessible()
  })
})
