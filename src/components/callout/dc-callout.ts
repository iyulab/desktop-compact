import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type CalloutVariant = 'info' | 'success' | 'warning' | 'danger'

/**
 * A note set into the page — a notice, a warning, an error — on a subtle ground with an edge in its
 * color, and room for actions at the end. The content and its role are the consumer's: an error
 * the user must hear gets `role="alert"` from the consumer.
 */
@customElement('dc-callout')
export class DcCallout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--dc-space-3, 12px);
      padding: var(--dc-space-2, 8px) var(--dc-space-3, 12px);
      border-left: 3px solid var(--_callout-edge);
      border-radius: var(--dc-radius-md, 6px);
      background: var(--_callout-ground);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
      font-size: var(--dc-callout-size, var(--dc-font-size-sm, 12px));
      --_callout-edge: var(--dc-color-secondary, #475569);
      --_callout-ground: var(--dc-color-secondary-subtle, color-mix(in srgb, var(--dc-color-secondary, #475569) 15%, transparent));
    }
    :host([variant='success']) {
      --_callout-edge: var(--dc-color-success, #16a34a);
      --_callout-ground: var(--dc-color-success-subtle, color-mix(in srgb, var(--dc-color-success, #16a34a) 15%, transparent));
    }
    :host([variant='warning']) {
      --_callout-edge: var(--dc-color-warning, #d97706);
      --_callout-ground: var(--dc-color-warning-subtle, color-mix(in srgb, var(--dc-color-warning, #d97706) 15%, transparent));
    }
    :host([variant='danger']) {
      --_callout-edge: var(--dc-color-danger, #dc2626);
      --_callout-ground: var(--dc-color-danger-subtle, color-mix(in srgb, var(--dc-color-danger, #dc2626) 15%, transparent));
    }
    .content {
      flex: 1;
      min-width: 0;
    }
    ::slotted(p) {
      margin: 0;
    }
    .actions {
      flex-shrink: 0;
      display: flex;
      gap: var(--dc-space-2, 8px);
    }
  `

  @property({ reflect: true })
  variant: CalloutVariant = 'info'

  render() {
    return html`<div class="content"><slot></slot></div><div class="actions"><slot name="actions"></slot></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-callout': DcCallout
  }
}
