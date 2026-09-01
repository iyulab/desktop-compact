import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-confirm-dialog.js'
import '../button/dc-button.js'
import type { DcConfirmDialog } from './dc-confirm-dialog.js'

const meta: Meta = {
  title: 'Primitives/ConfirmDialog',
  argTypes: {
    heading: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    danger: { control: 'boolean' },
  },
  args: {
    heading: 'Delete item?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    danger: true,
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <dc-button
      @click=${(e: Event) => {
        const root = (e.target as HTMLElement).getRootNode() as ShadowRoot | Document
        root.querySelector<DcConfirmDialog>('#demo-confirm')!.open = true
      }}
      >Delete</dc-button
    >
    <dc-confirm-dialog
      id="demo-confirm"
      heading=${args.heading}
      confirm-label=${args.confirmLabel}
      cancel-label=${args.cancelLabel}
      ?danger=${args.danger}
    >
      This action cannot be undone.
    </dc-confirm-dialog>
  `,
}
