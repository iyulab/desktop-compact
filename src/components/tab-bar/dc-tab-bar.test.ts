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

  it('is accessible', async () => {
    const el = await fixture<DcTabBar>(html`<dc-tab-bar .items=${ITEMS} active-id="overview"></dc-tab-bar>`)
    await expect(el).to.be.accessible()
  })
})
