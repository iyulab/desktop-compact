import type { Meta, StoryObj } from '@storybook/web-components'
import { LitElement, html } from 'lit'
import '../components/section-heading/dc-section-heading.js'
import '../components/card/dc-card.js'
import '../components/field/dc-field.js'
import '../components/input/dc-input.js'
import '../components/metric/dc-metric.js'
import '../components/badge/dc-badge.js'
import '../components/callout/dc-callout.js'
import '../components/button/dc-button.js'
import { tableStyles } from '../styles/table-styles.js'

/** A semantic table in a shadow root, styled with the shared `tableStyles`. */
class StoryLedger extends LitElement {
  static styles = tableStyles
  render() {
    return html`
      <table>
        <thead>
          <tr><th>Item</th><th class="num">Quantity</th><th class="num">Amount</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">Consulting</th><td class="num">12</td><td class="num">4,800</td></tr>
          <tr><th scope="row">Travel</th><td class="num">3</td><td class="num">720</td></tr>
          <tr><th scope="row">Materials</th><td class="num">40</td><td class="num">1,260</td></tr>
        </tbody>
        <tfoot>
          <tr><th scope="row">Total</th><td class="num">55</td><td class="num">6,780</td></tr>
        </tfoot>
      </table>
    `
  }
}
if (!customElements.get('story-ledger')) customElements.define('story-ledger', StoryLedger)

const meta: Meta = {
  title: 'Foundations/Hierarchy',
}
export default meta

type Story = StoryObj

const screen = () => html`
  <div style="display: grid; gap: 24px; max-width: 900px">
    <dc-section-heading marker heading="Session" description="Newest first"></dc-section-heading>

    <dc-card>
      <span slot="header">New session <b style="color: var(--dc-card-header-accent, var(--dc-color-secondary-text))">10</b></span>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px">
        <dc-field label="Date" required><dc-input aria-label="Date" type="date"></dc-input></dc-field>
        <dc-field label="Client"><dc-input aria-label="Client"></dc-input></dc-field>
        <dc-field label="Grade" hint="From the client"><dc-input aria-label="Grade"></dc-input></dc-field>
        <dc-field label="Quantity" error="Enter a number"><dc-input aria-label="Quantity"></dc-input></dc-field>
      </div>
      <dc-button slot="footer" variant="primary">Save</dc-button>
    </dc-card>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px">
      <dc-metric accent="1" label="People" value="38" unit="people">Up 6 on last month</dc-metric>
      <dc-metric accent="2" label="Hours" value="1,240" unit="h">Across all teams</dc-metric>
      <dc-metric label="Open items" value="12">Plain, no band</dc-metric>
      <dc-metric accent="1" label="On plan" value="94" unit="%">Within the plan</dc-metric>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 8px">
      <dc-badge>Default</dc-badge>
      <dc-badge variant="accent">Accent</dc-badge>
      <dc-badge variant="secondary">Secondary</dc-badge>
      <dc-badge variant="success">Success</dc-badge>
      <dc-badge variant="warning">Warning</dc-badge>
      <dc-badge variant="danger">Danger</dc-badge>
    </div>

    <div style="display: grid; gap: 8px">
      <dc-callout variant="info"><p>Records are kept in the folder you chose.</p></dc-callout>
      <dc-callout variant="success"><p>Saved.</p></dc-callout>
      <dc-callout variant="warning"><p>Two rows have no date.</p></dc-callout>
      <dc-callout variant="danger" role="alert"><p>Could not open the folder.</p></dc-callout>
    </div>

    <dc-card><story-ledger></story-ledger></dc-card>
  </div>
`

/** Section heading, card, fields, metrics, badges, callouts and a table, all on the default tokens. */
export const Hierarchy: Story = {
  render: () => screen(),
}

/**
 * The same screen under role overrides on a wrapping element. Setting a role on a subtree is an
 * ordinary definition, so it reaches every component inside; an app usually sets them on `:root`.
 */
export const BrandOverride: Story = {
  render: () => html`
    <div
      style="
        --dc-card-border: none;
        --dc-card-elevation: var(--dc-elevation-1);
        --dc-card-radius: var(--dc-radius-lg);
        --dc-card-bg: var(--dc-color-surface-raised);
        --dc-section-marker-color: var(--dc-color-secondary);
        --dc-selection-bg: color-mix(in srgb, var(--dc-color-accent) 10%, transparent);
        --dc-table-header-bg: transparent;
        --dc-table-total-rule: var(--dc-color-accent);
      "
    >
      ${screen()}
    </div>
  `,
}
