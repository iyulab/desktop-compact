import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type BadgeVariant = 'default' | 'accent' | 'secondary' | 'success' | 'warning' | 'danger'

@customElement('dc-badge')
export class DcBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    span {
      display: inline-flex;
      align-items: center;
      padding: 2px var(--dc-space-2, 8px);
      border-radius: var(--dc-radius-sm, 4px);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-font-size-xs, 11px);
      font-weight: var(--dc-font-weight-medium, 500);
      line-height: 1.4;
      white-space: nowrap;
    }
    :host([variant='default']) span {
      background: var(--dc-color-surface-hover, #ececed);
      color: var(--dc-color-text-secondary, #55555c);
    }
    /* Tinted variants: the ground is the fill's subtle token (a 15% tint by default), the label the
       fill's text form. The fill as text on its own tint is what drops a label under 4.5:1. */
    :host([variant='accent']) span {
      background: var(--dc-color-accent-subtle, color-mix(in srgb, var(--dc-color-accent, #2563eb) 15%, transparent));
      color: var(--dc-color-accent-text, var(--dc-color-accent, #2563eb));
    }
    :host([variant='secondary']) span {
      background: var(--dc-color-secondary-subtle, color-mix(in srgb, var(--dc-color-secondary, #475569) 15%, transparent));
      color: var(--dc-color-secondary-text, var(--dc-color-secondary, #475569));
    }
    :host([variant='success']) span {
      background: var(--dc-color-success-subtle, color-mix(in srgb, var(--dc-color-success, #16a34a) 15%, transparent));
      color: var(--dc-color-success-text, var(--dc-color-success, #16a34a));
    }
    :host([variant='warning']) span {
      background: var(--dc-color-warning-subtle, color-mix(in srgb, var(--dc-color-warning, #d97706) 15%, transparent));
      color: var(--dc-color-warning-text, var(--dc-color-warning, #d97706));
    }
    :host([variant='danger']) span {
      background: var(--dc-color-danger-subtle, color-mix(in srgb, var(--dc-color-danger, #dc2626) 15%, transparent));
      color: var(--dc-color-danger-text, var(--dc-color-danger, #dc2626));
    }
  `

  @property({ reflect: true })
  variant: BadgeVariant = 'default'

  render() {
    return html`<span><slot></slot></span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-badge': DcBadge
  }
}
