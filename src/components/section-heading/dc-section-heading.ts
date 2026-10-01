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
      font-weight: var(--dc-section-title-weight, var(--dc-font-weight-semibold, 600));
      color: var(--dc-color-text, #1a1a1e);
    }
    :host([marker]) h3 {
      display: flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      line-height: var(--dc-line-height-tight, 1.3);
    }
    :host([marker]) h3::before {
      content: '';
      flex: none;
      width: 3px;
      height: 0.95em;
      border-radius: 2px;
      background: var(--dc-section-marker-color, var(--dc-color-accent, #2563eb));
    }
    p {
      margin: var(--dc-space-1, 4px) 0 0;
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-section-description-color, var(--dc-color-text-muted, #686870));
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

  /** A short bar before the heading in the section marker color — marks a section among siblings. */
  @property({ type: Boolean, reflect: true })
  marker = false

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
