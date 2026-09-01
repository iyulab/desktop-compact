import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-status-strip.js'

const meta: Meta = {
  title: 'Primitives/StatusStrip',
  component: 'dc-status-strip',
  argTypes: {
    status: {
      control: 'select',
      options: ['idle', 'loading', 'error', 'done'],
    },
    label: { control: 'text' },
  },
  args: {
    status: 'idle',
    label: 'Ready',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`<dc-status-strip status=${args.status} label=${args.label}></dc-status-strip>`,
}

export const AllStates: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:8px;">
      <dc-status-strip status="idle" label="Idle"></dc-status-strip>
      <dc-status-strip status="loading" label="Saving…"></dc-status-strip>
      <dc-status-strip status="error" label="Save failed"></dc-status-strip>
      <dc-status-strip status="done" label="Saved"></dc-status-strip>
    </div>
  `,
}
