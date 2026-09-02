import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-delete-confirm-button.js'

const meta: Meta = {
  title: 'Primitives/DeleteConfirmButton',
  component: 'dc-delete-confirm-button',
  argTypes: {
    triggerLabel: { control: 'text' },
    confirmLabel: { control: 'text' },
  },
  args: {
    triggerLabel: 'Delete',
    confirmLabel: 'Confirm',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <dc-delete-confirm-button
      trigger-label=${args.triggerLabel}
      confirm-label=${args.confirmLabel}
    ></dc-delete-confirm-button>
  `,
}
