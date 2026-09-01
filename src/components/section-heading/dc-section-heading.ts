import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type SectionHeadingSize = 'lg' | 'md' | 'sm'

const TITLE_FONT_SIZE_VAR: Record<SectionHeadingSize, string> = {
  lg: 'var(--dc-font-size-lg, 15px)',
  md: 'var(--dc-font-size-md, 13px)',
  sm: 'var(--dc-font-size-sm, 12px)',
}

@customElement('dc-section-heading')
export class DcSectionHeading extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--dc-space-3, 12px);
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    .text {
      min-width: 0;
    }
    h3 {
      margin: 0;
      font-weight: var(--dc-font-weight-semibold, 600);
      color: var(--dc-color-text, #1a1a1e);
    }
    p {
      margin: var(--dc-space-1, 4px) 0 0;
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-color-text-muted, #8a8a92);
    }
    .actions {
      flex-shrink: 0;
      display: flex;
      gap: var(--dc-space-2, 8px);
    }
  `

  @property()
  heading = ''

  @property()
  description = ''

  @property({ reflect: true })
  size: SectionHeadingSize = 'md'

  render() {
    return html`
      <div class="text">
        <h3 style="font-size: ${TITLE_FONT_SIZE_VAR[this.size]}">${this.heading}</h3>
        ${this.description ? html`<p>${this.description}</p>` : ''}
      </div>
      <div class="actions"><slot name="actions"></slot></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-section-heading': DcSectionHeading
  }
}
