import { fixture, html, expect } from '@open-wc/testing'
import { LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FormAssociatedMixin } from './form-associated.js'

@customElement('test-form-el')
class TestFormEl extends FormAssociatedMixin(LitElement) {
  static styles = css`
    :host {
      display: inline-block;
    }
  `

  @property()
  value = ''

  private _resetCount = 0

  get resetCount() {
    return this._resetCount
  }

  firstUpdated() {
    this.internals.setFormValue(this.value)
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value)
    }
  }

  formResetCallback() {
    this._resetCount += 1
    this.value = ''
  }

  render() {
    return html`<slot></slot>`
  }
}

describe('FormAssociatedMixin', () => {
  it('attaches internals and declares formAssociated', async () => {
    const el = await fixture<TestFormEl>(html`<test-form-el></test-form-el>`)
    expect(el.internals).to.exist
    expect((TestFormEl as unknown as { formAssociated: boolean }).formAssociated).to.be.true
  })

  it('defaults disabled to false and reflects it as an attribute', async () => {
    const el = await fixture<TestFormEl>(html`<test-form-el></test-form-el>`)
    expect(el.disabled).to.be.false
    el.disabled = true
    await el.updateComplete
    expect(el.hasAttribute('disabled')).to.be.true
  })

  it('exposes the owning form via the form getter', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><test-form-el></test-form-el></form>`)
    const el = form.querySelector('test-form-el') as TestFormEl
    expect(el.form).to.equal(form)
  })

  it('participates in FormData once a value is set', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><test-form-el name="widget" value="hello"></test-form-el></form>`,
    )
    const el = form.querySelector('test-form-el') as TestFormEl
    el.setAttribute('name', 'widget')
    el.value = 'hello'
    await el.updateComplete
    expect(new FormData(form).get('widget')).to.equal('hello')
  })

  it('calls formResetCallback when the owning form resets', async () => {
    const form = await fixture<HTMLFormElement>(html`<form><test-form-el></test-form-el></form>`)
    const el = form.querySelector('test-form-el') as TestFormEl
    el.value = 'hello'
    await el.updateComplete
    form.reset()
    expect(el.resetCount).to.equal(1)
    expect(el.value).to.equal('')
  })

  it('proxies checkValidity/reportValidity/validity to internals', async () => {
    const el = await fixture<TestFormEl>(html`<test-form-el></test-form-el>`)
    expect(el.checkValidity()).to.be.true
    expect(el.validity.valid).to.be.true
    el.internals.setValidity({ customError: true }, 'nope')
    expect(el.checkValidity()).to.be.false
    expect(el.validationMessage).to.equal('nope')
  })

  it('sets disabled via formDisabledCallback (fieldset disabling)', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<fieldset disabled><test-form-el></test-form-el></fieldset>`,
    )
    const el = form.querySelector('test-form-el') as TestFormEl
    await el.updateComplete
    expect(el.disabled).to.be.true
  })
})
