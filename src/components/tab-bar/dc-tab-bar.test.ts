import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-tab-bar.js'
import type { DcTabBar, DcTabChangeEvent } from './dc-tab-bar.js'

const ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'settings', label: 'Settings' },
]

describe('dc-tab-bar', () => {
  it('renders a tab button per item', async () => {
    const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${ITEMS} active-id="overview"></dc-tab-bar>`)
    const buttons = el.shadowRoot!.querySelectorAll('button')
    expect(buttons.length).to.equal(2)
  })

  it('marks the active tab as aria-selected', async () => {
    const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${ITEMS} active-id="settings"></dc-tab-bar>`)
    const buttons = [...el.shadowRoot!.querySelectorAll('button')]
    expect(buttons[0].getAttribute('aria-selected')).to.equal('false')
    expect(buttons[1].getAttribute('aria-selected')).to.equal('true')
  })

  it('dispatches dc-tab-change with the clicked tab id', async () => {
    const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${ITEMS} active-id="overview"></dc-tab-bar>`)
    const buttons = el.shadowRoot!.querySelectorAll('button')
    setTimeout(() => (buttons[1] as HTMLButtonElement).click())
    const event = (await oneEvent(el, 'dc-tab-change')) as DcTabChangeEvent
    expect(event.tabId).to.equal('settings')
  })

  it('exposes role=tablist on the host', async () => {
    const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${ITEMS} active-id="overview"></dc-tab-bar>`)
    expect(el.getAttribute('role')).to.equal('tablist')
  })

  describe('keyboard (WAI-ARIA tabs pattern)', () => {
    const THREE = [...ITEMS, { id: 'history', label: 'History' }]
    const tabs = (el: DcTabBar) => [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('button[role="tab"]')]
    const press = (button: HTMLButtonElement, key: string) =>
      button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

    it('is a single Tab stop on the selected tab', async () => {
      const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${THREE} active-id="settings"></dc-tab-bar>`)
      expect(tabs(el).map((b) => b.tabIndex)).to.deep.equal([-1, 0, -1])
    })

    it('puts the Tab stop on the first tab when nothing is selected', async () => {
      const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${THREE} active-id=""></dc-tab-bar>`)
      expect(tabs(el).map((b) => b.tabIndex)).to.deep.equal([0, -1, -1])
    })

    it('ArrowRight focuses and selects the next tab, wrapping at the end', async () => {
      const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${THREE} active-id="history"></dc-tab-bar>`)
      setTimeout(() => press(tabs(el)[2], 'ArrowRight'))
      const event = (await oneEvent(el, 'dc-tab-change')) as DcTabChangeEvent
      expect(event.tabId).to.equal('overview')
      await el.updateComplete
      expect(el.shadowRoot!.activeElement).to.equal(tabs(el)[0])
      expect(tabs(el)[0].getAttribute('aria-selected')).to.equal('true')
      expect(tabs(el).map((b) => b.tabIndex)).to.deep.equal([0, -1, -1])
    })

    it('ArrowLeft wraps from the first tab to the last', async () => {
      const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${THREE} active-id="overview"></dc-tab-bar>`)
      setTimeout(() => press(tabs(el)[0], 'ArrowLeft'))
      const event = (await oneEvent(el, 'dc-tab-change')) as DcTabChangeEvent
      expect(event.tabId).to.equal('history')
    })

    it('Home and End jump to the first and last tab', async () => {
      const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${THREE} active-id="settings"></dc-tab-bar>`)
      setTimeout(() => press(tabs(el)[1], 'End'))
      expect(((await oneEvent(el, 'dc-tab-change')) as DcTabChangeEvent).tabId).to.equal('history')
      await el.updateComplete
      setTimeout(() => press(tabs(el)[2], 'Home'))
      expect(((await oneEvent(el, 'dc-tab-change')) as DcTabChangeEvent).tabId).to.equal('overview')
    })

    it('handles only the navigation keys — other keys keep their default', async () => {
      const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${THREE} active-id="overview"></dc-tab-bar>`)
      expect(press(tabs(el)[0], 'a')).to.equal(true)
      expect(press(tabs(el)[0], 'ArrowRight')).to.equal(false)
    })

    it('with activation="manual", arrows move focus without selecting', async () => {
      const el = await fixture<DcTabBar>(
        html`<dc-tab-bar .items=${THREE} active-id="overview" activation="manual"></dc-tab-bar>`
      )
      let changes = 0
      el.addEventListener('dc-tab-change', () => changes++)
      press(tabs(el)[0], 'ArrowRight')
      await el.updateComplete
      expect(el.shadowRoot!.activeElement).to.equal(tabs(el)[1])
      expect(changes).to.equal(0)
      expect(tabs(el)[0].getAttribute('aria-selected')).to.equal('true')
      tabs(el)[1].click()
      expect(changes).to.equal(1)
    })
  })

  it('is accessible', async () => {
    const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${ITEMS} active-id="overview"></dc-tab-bar>`)
    await expect(el).to.be.accessible()
  })
})
