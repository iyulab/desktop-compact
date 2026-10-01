import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-metric.js'
import '../badge/dc-badge.js'

const meta: Meta = {
  title: 'Primitives/Metric',
  component: 'dc-metric',
}
export default meta

type Story = StoryObj

export const Variants: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 900px">
      <dc-metric accent="1" label="People" value="38" unit="people">Up 6 on last month</dc-metric>
      <dc-metric accent="2" label="Hours" value="1,240" unit="h">Across all teams</dc-metric>
      <dc-metric label="Open items" value="12">Plain, no band</dc-metric>
      <dc-metric accent="1" label="Status" value="94" unit="%">
        <dc-badge slot="label-extra" variant="success">On track</dc-badge>
        Within the plan
      </dc-metric>
    </div>
  `,
}
