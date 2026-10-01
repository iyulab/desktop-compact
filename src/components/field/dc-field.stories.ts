import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-field.js'
import '../input/dc-input.js'
import '../textarea/dc-textarea.js'

const meta: Meta = {
  title: 'Primitives/Field',
  component: 'dc-field',
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => html`
    <dc-field label="Date" hint="Calendar date" required>
      <dc-input aria-label="Date" type="date"></dc-input>
    </dc-field>
  `,
}

export const InAGrid: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 900px">
      <dc-field label="Date" required><dc-input aria-label="Date" type="date"></dc-input></dc-field>
      <dc-field label="Client"><dc-input aria-label="Client"></dc-input></dc-field>
      <dc-field label="Grade" hint="From the client"><dc-input aria-label="Grade"></dc-input></dc-field>
      <dc-field label="Quantity" error="Enter a number"><dc-input aria-label="Quantity"></dc-input></dc-field>
      <dc-field label="Note" span="2"><dc-textarea aria-label="Note"></dc-textarea></dc-field>
    </div>
  `,
}
