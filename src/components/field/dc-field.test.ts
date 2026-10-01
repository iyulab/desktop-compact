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
