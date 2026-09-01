import { LitElement, svg, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type SpinnerSize = 'sm' | 'md' | 'lg'

const SIZE_PX: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32 }

@customElement('dc-spinner')
export class DcSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      color: var(--dc-color-accent, #2563eb);
    }
    svg {
      animation: dc-spin 0.75s linear infinite;
    }
    @keyframes dc-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `

  @property({ reflect: true })
  size: SpinnerSize = 'md'

  render() {
    const px = SIZE_PX[this.size]
    return svg`<svg width=${px} height=${px} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-spinner': DcSpinner
  }
}
