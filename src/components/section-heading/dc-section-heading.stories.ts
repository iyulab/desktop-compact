import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-section-heading.js'

const meta: Meta = {
  title: 'Primitives/SectionHeading',
  component: 'dc-section-heading',
  argTypes: {
    size: { control: 'select', options: ['lg', 'md', 'sm'] },
  },
  args: {
    heading: 'Recent runs',
    description: 'Last 10 pipeline executions',
    size: 'md',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <dc-section-heading heading=${args.heading} description=${args.description} size=${args.size}>
      <button slot="actions">View all</button>
    </dc-section-heading>
  `,
}
