import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-callout.js'
import '../button/dc-button.js'

const meta: Meta = {
  title: 'Primitives/Callout',
  component: 'dc-callout',
}
export default meta

type Story = StoryObj

export const Variants: Story = {
  render: () => html`
    <div style="display: grid; gap: 12px; max-width: 560px">
      <dc-callout variant="info"><p>Records are kept in the folder you chose.</p></dc-callout>
      <dc-callout variant="success"><p>Saved.</p></dc-callout>
      <dc-callout variant="warning"><p>Two rows have no date.</p></dc-callout>
      <dc-callout variant="danger" role="alert"><p>Could not open the folder.</p></dc-callout>
    </div>
  `,
}

export const WithAction: Story = {
  render: () => html`
    <dc-callout variant="warning" style="max-width: 560px">
      <p>Two rows have no date.</p>
      <dc-button slot="actions" size="sm">Review</dc-button>
    </dc-callout>
  `,
}
