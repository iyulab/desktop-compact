import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-dialog.js'
import '../button/dc-button.js'
import type { DcDialog } from './dc-dialog.js'

const meta: Meta = {
  title: 'Primitives/Dialog',
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => html`
    <dc-button
      @click=${(e: Event) => {
        const root = (e.target as HTMLElement).getRootNode() as ShadowRoot | Document
        root.querySelector<DcDialog>('#demo-dialog')!.open = true
      }}
      >Open dialog</dc-button
    >
    <dc-dialog id="demo-dialog" aria-label="Example dialog">
      <p>This is dialog content.</p>
      <dc-button
        @click=${(e: Event) => {
          const root = (e.target as HTMLElement).getRootNode() as ShadowRoot | Document
          root.querySelector<DcDialog>('#demo-dialog')!.open = false
        }}
        >Close</dc-button
      >
    </dc-dialog>
  `,
}
