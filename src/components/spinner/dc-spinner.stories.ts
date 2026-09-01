import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-spinner.js'

const meta: Meta = {
  title: 'Primitives/Spinner',
  component: 'dc-spinner',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args: Record<string, unknown>) => html`<dc-spinner size=${args.size}></dc-spinner>`,
}

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; align-items:center; gap:12px;">
      <dc-spinner size="sm"></dc-spinner>
      <dc-spinner size="md"></dc-spinner>
      <dc-spinner size="lg"></dc-spinner>
    </div>
  `,
}
