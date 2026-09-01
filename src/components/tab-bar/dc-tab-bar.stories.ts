import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-tab-bar.js'

const meta: Meta = {
  title: 'Primitives/TabBar',
  component: 'dc-tab-bar',
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => html`
    <dc-tab-bar
      .items=${[
        { id: 'overview', label: 'Overview' },
        { id: 'settings', label: 'Settings' },
        { id: 'history', label: 'History' },
      ]}
      active-id="overview"
    ></dc-tab-bar>
  `,
}
