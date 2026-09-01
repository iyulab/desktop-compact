import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import './dc-badge.js'

const meta: Meta = {
  title: 'Primitives/Badge',
  component: 'dc-badge',
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'success', 'warning', 'danger'],
    },
  },
  args: {
    variant: 'default',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`<dc-badge variant=${args.variant}>Label</dc-badge>`,
}

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap:8px;">
      <dc-badge variant="default">Default</dc-badge>
      <dc-badge variant="accent">Accent</dc-badge>
      <dc-badge variant="success">Success</dc-badge>
      <dc-badge variant="warning">Warning</dc-badge>
      <dc-badge variant="danger">Danger</dc-badge>
    </div>
  `,
}
