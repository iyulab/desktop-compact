import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-segmented-control.js'

const meta: Meta = {
  title: 'Primitives/SegmentedControl',
  component: 'dc-segmented-control',
}
export default meta

type Story = StoryObj

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export const Default: Story = {
  render: () => html`
    <dc-segmented-control .options=${OPTIONS} value="week" aria-label="Period"></dc-segmented-control>
  `,
}

export const Small: Story = {
  render: () => html`
    <dc-segmented-control .options=${OPTIONS} value="day" size="sm" aria-label="Period"></dc-segmented-control>
  `,
}

export const WithDisabledOption: Story = {
  render: () => html`
    <dc-segmented-control
      .options=${[OPTIONS[0], { ...OPTIONS[1], disabled: true }, OPTIONS[2]]}
      value="day"
      aria-label="Period"
    ></dc-segmented-control>
  `,
}
