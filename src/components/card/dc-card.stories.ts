import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-card.js'

const meta: Meta = {
  title: 'Primitives/Card',
  component: 'dc-card',
  argTypes: {
    interactive: { control: 'boolean' },
    compact: { control: 'boolean' },
  },
  args: { interactive: false, compact: false },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <dc-card ?interactive=${args.interactive} ?compact=${args.compact} style="max-width:280px;">
      Card content goes here.
    </dc-card>
  `,
}

export const WithHeaderAndFooter: Story = {
  render: () => html`
    <dc-card style="max-width:420px">
      <span slot="header">New session <b data-accent style="color: var(--dc-card-header-accent)">10</b></span>
      Fields go here.
      <button slot="footer">Save</button>
    </dc-card>
  `,
}
