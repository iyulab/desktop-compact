import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-empty-state.js'

const meta: Meta = {
  title: 'Primitives/EmptyState',
  component: 'dc-empty-state',
  args: {
    heading: 'No projects yet',
    description: 'Create your first project to get started.',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <dc-empty-state heading=${args.heading} description=${args.description}>
      <span slot="icon">＋</span>
      <button slot="actions">New project</button>
    </dc-empty-state>
  `,
}
