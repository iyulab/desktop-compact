import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-checkbox.js'

const meta: Meta = {
  title: 'Primitives/Checkbox',
  component: 'dc-checkbox',
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => html`<dc-checkbox>Include archived items</dc-checkbox>`,
}

export const States: Story = {
  render: () => html`
    <div style="display: grid; gap: 8px">
      <dc-checkbox checked>Checked</dc-checkbox>
      <dc-checkbox .indeterminate=${true}>Indeterminate</dc-checkbox>
      <dc-checkbox disabled>Disabled</dc-checkbox>
      <dc-checkbox disabled checked>Disabled, checked</dc-checkbox>
    </div>
  `,
}
