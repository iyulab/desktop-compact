import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-select.js'
import type { SelectOption } from './dc-select.js'

const OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived', disabled: true },
]

const meta: Meta = {
  title: 'Primitives/Select',
  component: 'dc-select',
  argTypes: {
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Choose a status',
    required: false,
    disabled: false,
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) =>
    html`<dc-select
      .options=${OPTIONS}
      placeholder=${args.placeholder}
      aria-label="Status"
      ?required=${args.required}
      ?disabled=${args.disabled}
    ></dc-select>`,
}
