import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-textarea.js'

const meta: Meta = {
  title: 'Primitives/Textarea',
  component: 'dc-textarea',
  argTypes: {
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Notes',
    rows: 3,
    required: false,
    disabled: false,
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) =>
    html`<dc-textarea
      placeholder=${args.placeholder}
      rows=${args.rows}
      ?required=${args.required}
      ?disabled=${args.disabled}
    ></dc-textarea>`,
}
