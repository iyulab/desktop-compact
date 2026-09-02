import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-context-menu.js'
import type { DcContextMenu, ContextMenuItem } from './dc-context-menu.js'

const ITEMS: ContextMenuItem[] = [
  { value: 'rename', label: 'Rename', icon: '✎' },
  { separator: true },
  { value: 'archive', label: 'Archive', disabled: true },
  { value: 'delete', label: 'Delete', danger: true },
]

async function openMenu(items = ITEMS): Promise<DcContextMenu> {
  const el = await fixture<DcContextMenu>(html`<dc-context-menu .items=${items}></dc-context-menu>`)
  el.open = true
  await el.updateComplete
  return el
}

describe('dc-context-menu', () => {
  it('is closed by default', async () => {
    const el = await fixture<DcContextMenu>(html`<dc-context-menu></dc-context-menu>`)
    expect(el.open).to.be.false
    expect(el.matches(':popover-open')).to.be.false
  })

  it('reflects open to :popover-open', async () => {
    const el = await openMenu()
    expect(el.matches(':popover-open')).to.be.true
    el.open = false
    await el.updateComplete
    expect(el.matches(':popover-open')).to.be.false
  })

  it('renders menuitem buttons for items and a separator for separator entries', async () => {
    const el = await openMenu()
    const buttons = el.shadowRoot!.querySelectorAll('[role="menuitem"]')
    expect(buttons.length).to.equal(3)
    expect(buttons[0].textContent?.trim()).to.contain('Rename')
    const separators = el.shadowRoot!.querySelectorAll('[role="separator"]')
    expect(separators.length).to.equal(1)
  })

  it('marks disabled items disabled and non-activatable', async () => {
    const el = await openMenu()
    const archiveButton = el.shadowRoot!.querySelectorAll('[role="menuitem"]')[1] as HTMLButtonElement
    expect(archiveButton.disabled).to.be.true
  })

  it('dispatches select with the item and index, and closes, when an enabled item is clicked', async () => {
    const el = await openMenu()
    const deleteButton = el.shadowRoot!.querySelectorAll('[role="menuitem"]')[2] as HTMLButtonElement
    const listener = oneEvent(el, 'select')
    deleteButton.click()
    const event = await listener
    expect(event.detail.item.value).to.equal('delete')
    expect(event.detail.index).to.equal(3)
    expect(el.open).to.be.false
  })

  it('dispatches close when an item is selected', async () => {
    const el = await openMenu()
    const renameButton = el.shadowRoot!.querySelectorAll('[role="menuitem"]')[0] as HTMLButtonElement
    const listener = oneEvent(el, 'close')
    renameButton.click()
    await listener
  })

  it('moves roving focus with ArrowDown, skipping separators and disabled items — real DOM focus, not just tabindex', async () => {
    const el = await openMenu()
    const root = el.shadowRoot!.querySelector('[part="menu"]')!
    // index 0 (rename) -> next enabled is index 3 (delete), skipping the separator (index 1) and
    // disabled archive (index 2)
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete
    const deleteButton = el.shadowRoot!.querySelector('[data-index="3"]')!
    expect(deleteButton.getAttribute('tabindex')).to.equal('0')
    expect(el.shadowRoot!.activeElement).to.equal(deleteButton)
  })

  it('advances on a second consecutive ArrowDown — regression for an index-space mismatch between the full items array and the rendered menuitem-only NodeList', async () => {
    const el = await openMenu()
    const root = el.shadowRoot!.querySelector('[part="menu"]')!
    // rename(0) -[Down]-> delete(3, skipping separator+disabled) -[Down]-> wraps back to rename(0)
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete
    const renameButton = el.shadowRoot!.querySelector('[data-index="0"]')!
    expect(el.shadowRoot!.activeElement).to.equal(renameButton)
  })

  it('wraps roving focus at the boundary — real DOM focus', async () => {
    const el = await openMenu()
    const root = el.shadowRoot!.querySelector('[part="menu"]')!
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await el.updateComplete
    // starts at rename (enabled index 0); ArrowUp wraps to the last enabled item (delete, index 3)
    const deleteButton = el.shadowRoot!.querySelector('[data-index="3"]')!
    expect(el.shadowRoot!.activeElement).to.equal(deleteButton)
  })

  it('dispatches select when Enter is pressed on the focused item', async () => {
    const el = await openMenu()
    const root = el.shadowRoot!.querySelector('[part="menu"]')!
    const listener = oneEvent(el, 'select')
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    const event = await listener
    expect(event.detail.item.value).to.equal('rename')
  })

  it('has role=menu on the host and forwards a host aria-label', async () => {
    const el = await fixture<DcContextMenu>(
      html`<dc-context-menu aria-label="Row actions"></dc-context-menu>`,
    )
    expect(el.getAttribute('role')).to.equal('menu')
    expect(el.getAttribute('aria-label')).to.equal('Row actions')
  })

  it('is accessible', async () => {
    const el = await openMenu()
    await expect(el).to.be.accessible()
  })
})
