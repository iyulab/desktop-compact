import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-toast.js'

const meta: Meta = {
  title: 'Primitives/Toast',
  component: 'dc-toast',
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    message: { control: 'text' },
    actionLabel: { control: 'text' },
    dismissLabel: { control: 'text' },
  },
  args: {
    variant: 'info',
    message: 'Saved successfully',
    actionLabel: '',
    dismissLabel: 'Dismiss',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <dc-toast
      variant=${args.variant}
      message=${args.message}
      action-label=${args.actionLabel}
      dismiss-label=${args.dismissLabel}
    ></dc-toast>
  `,
}

export const WithAction: Story = {
  render: () => html`
    <dc-toast
      variant="info"
      message="File deleted"
      action-label="Undo"
      dismiss-label="Dismiss"
    ></dc-toast>
  `,
}

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:8px;">
      <dc-toast variant="info" message="Sync in progress" dismiss-label="Dismiss"></dc-toast>
      <dc-toast variant="success" message="Saved successfully" dismiss-label="Dismiss"></dc-toast>
      <dc-toast variant="warning" message="Connection unstable" dismiss-label="Dismiss"></dc-toast>
      <dc-toast variant="error" message="Save failed" dismiss-label="Dismiss"></dc-toast>
    </div>
  `,
}
