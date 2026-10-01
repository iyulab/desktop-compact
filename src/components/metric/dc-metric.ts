import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type MetricAccent = '' | '1' | '2'

/** One figure that a page is about, on a card: a label, the value with its unit, a line under it. */
@customElement('dc-metric')
export class DcMetric extends LitElement {
  static styles = css`
    :host {
      display: grid;
      gap: 2px;
      position: relative;
      overflow: hidden;
      padding: var(--dc-space-3, 12px) var(--dc-space-4, 16px);
      background: var(--dc-card-bg, var(--dc-color-surface, #f7f7f8));
      border: var(--dc-card-border, 1px solid var(--dc-color-border, #e2e2e4));
      border-radius: var(--dc-card-radius, var(--dc-radius-md, 6px));
      box-shadow: var(--dc-card-elevation, none);
      color: var(--dc-color-text, #1a1a1e);
      font-family: var(--dc-font-family, system-ui, sans-serif);
    }
    :host([accent='1'])::before,
    :host([accent='2'])::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 4px;
    }
    :host([accent='1'])::before {
      background: var(--dc-metric-accent-1, var(--dc-color-accent, #2563eb));
    }
    :host([accent='2'])::before {
      background: var(--dc-metric-accent-2, var(--dc-color-secondary, #475569));
    }
    .label {
      display: flex;
      align-items: center;
      gap: var(--dc-space-2, 8px);
      font-size: var(--dc-font-size-sm, 12px);
      font-weight: var(--dc-font-weight-medium, 500);
      color: var(--dc-color-text-secondary, #55555c);
    }
    .value {
      font-size: var(--dc-metric-size, var(--dc-font-size-display, 28px));
      font-weight: var(--dc-font-weight-bold, 700);
      line-height: var(--dc-line-height-tight, 1.3);
      font-variant-numeric: tabular-nums;
    }
    .unit {
      margin-left: 0;
      font-size: var(--dc-font-size-md, 13px);
      font-weight: var(--dc-font-weight-medium, 500);
      color: var(--dc-color-text-secondary, #55555c);
    }
    .sub {
      font-size: var(--dc-font-size-sm, 12px);
      color: var(--dc-color-text-secondary, #55555c);
    }
  `

  @property() label = ''
  @property() value = ''
  @property() unit = ''
  @property({ reflect: true }) accent: MetricAccent = ''

  render() {
    return html`
      <span class="label">${this.label}<slot name="label-extra"></slot></span>
      <span class="value">${this.value} ${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}</span>
      <span class="sub"><slot></slot></span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dc-metric': DcMetric
  }
}
