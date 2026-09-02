import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './dc-delete-confirm-button.js'
import type { DcDeleteConfirmButton } from './dc-delete-confirm-button.js'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('dc-delete-confirm-button', () => {
  it('starts in the idle (trigger) state — not confirming', async () => {
    const el = await fixture<DcDeleteConfirmButton>(html`<dc-delete-confirm-button></dc-delete-confirm-button>`)
    expect(el.confirming).to.be.false
  })

  it('defaults triggerLabel/confirmLabel to empty — no baked-in text', async () => {
    const el = await fixture<DcDeleteConfirmButton>(html`<dc-delete-confirm-button></dc-delete-confirm-button>`)
    expect(el.triggerLabel).to.equal('')
    expect(el.confirmLabel).to.equal('')
  })

  it('forwards triggerLabel as the idle button aria-label', async () => {
    const el = await fixture<DcDeleteConfirmButton>(
      html`<dc-delete-confirm-button trigger-label="Delete"></dc-delete-confirm-button>`,
    )
    const inner = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    expect(inner.getAttribute('aria-label')).to.equal('Delete')
  })

  it('switches to the confirming state when the idle button is clicked', async () => {
    const el = await fixture<DcDeleteConfirmButton>(
      html`<dc-delete-confirm-button confirm-label="Confirm"></dc-delete-confirm-button>`,
    )
    const inner = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    inner.click()
    await el.updateComplete
    expect(el.confirming).to.be.true
    const confirmButton = el.shadowRoot!.querySelector('dc-button')!
    expect(confirmButton.textContent?.trim()).to.equal('Confirm')
  })

  it('dispatches confirm and resets to idle when the confirm-state button is clicked', async () => {
    const el = await fixture<DcDeleteConfirmButton>(
      html`<dc-delete-confirm-button confirm-label="Confirm"></dc-delete-confirm-button>`,
    )
    const trigger = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    trigger.click()
    await el.updateComplete
    const confirmInner = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    const listener = oneEvent(el, 'confirm')
    confirmInner.click()
    await listener
    await el.updateComplete
    expect(el.confirming).to.be.false
  })

  it('resets to idle after the confirm-state button loses focus (200ms)', async () => {
    const el = await fixture<DcDeleteConfirmButton>(
      html`<dc-delete-confirm-button confirm-label="Confirm"></dc-delete-confirm-button>`,
    )
    const trigger = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    trigger.click()
    await el.updateComplete
    expect(el.confirming).to.be.true
    const confirmInner = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    confirmInner.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }))
    await wait(250)
    expect(el.confirming).to.be.false
  })

  it('renders the confirm-state button with variant=danger', async () => {
    const el = await fixture<DcDeleteConfirmButton>(
      html`<dc-delete-confirm-button confirm-label="Confirm"></dc-delete-confirm-button>`,
    )
    const trigger = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    trigger.click()
    await el.updateComplete
    const confirmButton = el.shadowRoot!.querySelector('dc-button')!
    expect(confirmButton.getAttribute('variant')).to.equal('danger')
  })

  it('is accessible in both states', async () => {
    const el = await fixture<DcDeleteConfirmButton>(
      html`<dc-delete-confirm-button trigger-label="Delete" confirm-label="Confirm"></dc-delete-confirm-button>`,
    )
    await expect(el).to.be.accessible()
    const trigger = el.shadowRoot!.querySelector('dc-button')!.shadowRoot!.querySelector('button')!
    trigger.click()
    await el.updateComplete
    await expect(el).to.be.accessible()
  })
})
