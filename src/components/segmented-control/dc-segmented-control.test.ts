import { fixture, html, expect } from '@open-wc/testing'
import './dc-segmented-control.js'
import type { DcSegmentedControl } from './dc-segmented-control.js'

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const segments = (el: DcSegmentedControl) => [
  ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('button[role="radio"]'),
]
const press = (button: HTMLButtonElement, key: string) =>
  button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

describe('dc-segmented-control', () => {
  it('is a radiogroup of radios with the current value checked', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${OPTIONS} value="week" aria-label="Period"></dc-segmented-control>`,
    )
    expect(el.getAttribute('role')).to.equal('radiogroup')
    expect(segments(el).map((s) => s.getAttribute('aria-checked'))).to.deep.equal(['false', 'true', 'false'])
    expect(segments(el).map((s) => s.textContent?.trim())).to.deep.equal(['Day', 'Week', 'Month'])
  })

  it('is a single Tab stop on the checked segment, or the first enabled one', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${OPTIONS} value="month"></dc-segmented-control>`,
    )
    expect(segments(el).map((s) => s.tabIndex)).to.deep.equal([-1, -1, 0])

    const none = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${[{ value: 'x', label: 'X', disabled: true }, ...OPTIONS]}></dc-segmented-control>`,
    )
    expect(segments(none).map((s) => s.tabIndex)).to.deep.equal([-1, 0, -1, -1])
  })

  it('clicking a segment checks it and dispatches one bubbling, composed change', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${OPTIONS} value="day"></dc-segmented-control>`,
    )
    const seen: Event[] = []
    el.addEventListener('change', (e) => seen.push(e))
    segments(el)[2].click()
    await el.updateComplete
    expect(el.value).to.equal('month')
    expect(segments(el)[2].getAttribute('aria-checked')).to.equal('true')
    expect(seen.length).to.equal(1)
    expect(seen[0].bubbles).to.be.true
    expect(seen[0].composed).to.be.true

    segments(el)[2].click()
    expect(seen.length, 'clicking the checked segment is not a change').to.equal(1)
  })

  it('does not dispatch change when value is set programmatically', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${OPTIONS} value="day"></dc-segmented-control>`,
    )
    let changes = 0
    el.addEventListener('change', () => changes++)
    el.value = 'week'
    await el.updateComplete
    expect(changes).to.equal(0)
    expect(segments(el)[1].getAttribute('aria-checked')).to.equal('true')
  })

  it('arrow keys move to, focus and check the next segment, wrapping and skipping disabled ones', async () => {
    const opts = [OPTIONS[0], { ...OPTIONS[1], disabled: true }, OPTIONS[2]]
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${opts} value="day"></dc-segmented-control>`,
    )
    expect(press(segments(el)[0], 'ArrowRight')).to.equal(false)
    await el.updateComplete
    await el.updateComplete
    expect(el.value).to.equal('month')
    expect(el.shadowRoot!.activeElement).to.equal(segments(el)[2])

    press(segments(el)[2], 'ArrowDown')
    await el.updateComplete
    expect(el.value, 'wraps past the end').to.equal('day')

    press(segments(el)[0], 'ArrowLeft')
    await el.updateComplete
    expect(el.value, 'wraps past the start, skipping the disabled one').to.equal('month')

    press(segments(el)[2], 'ArrowUp')
    await el.updateComplete
    expect(el.value).to.equal('day')
  })

  it('leaves other keys alone', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${OPTIONS} value="day"></dc-segmented-control>`,
    )
    expect(press(segments(el)[0], 'Home')).to.equal(true)
    expect(el.value).to.equal('day')
  })

  it('a disabled option and a disabled group cannot be picked', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${[OPTIONS[0], { ...OPTIONS[1], disabled: true }]} value="day"></dc-segmented-control>`,
    )
    segments(el)[1].click()
    expect(el.value).to.equal('day')

    el.disabled = true
    await el.updateComplete
    expect(el.getAttribute('aria-disabled')).to.equal('true')
    expect(segments(el).every((s) => s.disabled)).to.be.true
  })

  it('participates in FormData and resets with its form', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><dc-segmented-control name="period" .options=${OPTIONS} value="week"></dc-segmented-control></form>`,
    )
    const el = form.querySelector('dc-segmented-control') as DcSegmentedControl
    await el.updateComplete
    expect(new FormData(form).get('period')).to.equal('week')
    segments(el)[0].click()
    await el.updateComplete
    expect(new FormData(form).get('period')).to.equal('day')
    form.reset()
    expect(el.value).to.equal('week')
  })

  it('is accessible', async () => {
    const el = await fixture<DcSegmentedControl>(
      html`<dc-segmented-control .options=${OPTIONS} value="week" aria-label="Period"></dc-segmented-control>`,
    )
    await expect(el).to.be.accessible()
  })
})
