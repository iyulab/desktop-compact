import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-input.js'
import '../button/dc-button.js'

const meta: Meta = {
  title: 'Primitives/Input',
  component: 'dc-input',
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    type: 'text',
    placeholder: 'Type here',
    required: false,
    disabled: false,
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) =>
    html`<dc-input
      type=${args.type}
      placeholder=${args.placeholder}
      ?required=${args.required}
      ?disabled=${args.disabled}
    ></dc-input>`,
}

export const Invalid: Story = {
  render: () => html`
    <form @submit=${(e: Event) => e.preventDefault()}>
      <dc-input required placeholder="Required field"></dc-input>
      <dc-button type="submit" style="margin-top: 8px;">Validate</dc-button>
    </form>
  `,
}
