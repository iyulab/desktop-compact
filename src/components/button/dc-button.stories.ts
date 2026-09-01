import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-button.js'

const meta: Meta = {
  title: 'Primitives/Button',
  component: 'dc-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'secondary',
    type: 'button',
    disabled: false,
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) =>
    html`<dc-button variant=${args.variant} type=${args.type} ?disabled=${args.disabled}
      >Save</dc-button
    >`,
}

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap:8px;">
      <dc-button variant="primary">Primary</dc-button>
      <dc-button variant="secondary">Secondary</dc-button>
      <dc-button variant="ghost">Ghost</dc-button>
      <dc-button variant="danger">Danger</dc-button>
      <dc-button variant="primary" disabled>Disabled</dc-button>
    </div>
  `,
}
