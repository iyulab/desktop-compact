import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-data-table.js'
import type { DataTableColumn, DataTableRow } from './dc-data-table.js'

const columns: DataTableColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'severity', label: 'Severity' },
  { key: 'steps', label: 'Steps' },
]
const rows: DataTableRow[] = [
  { id: 'a', cells: { title: 'Freezes after saving', severity: 'High', steps: '1. Open a file\n2. Save it' } },
  { id: 'b', cells: { title: 'Slow to open', severity: 'Low', steps: 'Open a large file' } },
  { id: 'c', cells: { title: 'Wrong date format', severity: 'Medium' } },
]

const meta: Meta = {
  title: 'Primitives/DataTable',
  component: 'dc-data-table',
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => html`<dc-data-table
    style="max-height: 240px"
    .columns=${columns}
    .rows=${rows}
    @activate=${(e: CustomEvent<{ id: string }>) => console.log('activate', e.detail.id)}
  ></dc-data-table>`,
}

export const Empty: Story = {
  render: () => html`<dc-data-table .columns=${columns} .rows=${[]} empty-label="No records yet"></dc-data-table>`,
}
