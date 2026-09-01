import { LitElement, type PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T

export declare class FormAssociatedInterface {
  readonly internals: ElementInternals
  disabled: boolean
  readonly form: HTMLFormElement | null
  readonly validity: ValidityState
  readonly validationMessage: string
  readonly willValidate: boolean
  checkValidity(): boolean
  reportValidity(): boolean
  formDisabledCallback(disabled: boolean): void
  formResetCallback(): void
  formStateRestoreCallback(
    state: string | File | FormData | null,
    mode: 'restore' | 'autocomplete',
  ): void
}

export const FormAssociatedMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  abstract class FormAssociatedElement extends superClass {
    static formAssociated = true

    static shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true,
    }

    readonly internals: ElementInternals

    @property({ type: Boolean, reflect: true })
    disabled = false

    constructor(...args: any[]) {
      super(...args)
      this.internals = this.attachInternals()
    }

    get form(): HTMLFormElement | null {
      return this.internals.form
    }

    get validity(): ValidityState {
      return this.internals.validity
    }

    get validationMessage(): string {
      return this.internals.validationMessage
    }

    get willValidate(): boolean {
      return this.internals.willValidate
    }

    checkValidity(): boolean {
      return this.internals.checkValidity()
    }

    reportValidity(): boolean {
      return this.internals.reportValidity()
    }

    formDisabledCallback(disabled: boolean): void {
      this.disabled = disabled
    }

    formResetCallback(): void {
      // Concrete components override this to reset their own value property.
    }

    formStateRestoreCallback(
      _state: string | File | FormData | null,
      _mode: 'restore' | 'autocomplete',
    ): void {
      // Concrete components override this for autofill/back-forward-cache restoration.
    }

    protected willUpdate(changed: PropertyValues<this>): void {
      super.willUpdate?.(changed)
    }
  }

  return FormAssociatedElement as unknown as Constructor<FormAssociatedInterface> & T
}
