import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-paste-rows-zone.js'
import '../toast/dc-toast.js'
import type { DcToast } from '../toast/dc-toast.js'

const meta: Meta = {
  title: 'Primitives/PasteRowsZone',
  component: 'dc-paste-rows-zone',
  argTypes: {
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: '📋 Paste rows from Excel or Word',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => html`<dc-paste-rows-zone placeholder=${args.placeholder}></dc-paste-rows-zone>`,
}

// Demonstrates the intended composition: dc-paste-rows-zone has no internal feedback UI, so a
// consumer wanting "N rows imported" feedback composes it with dc-toast (see cycle-1113/1114 —
// this component is display/parse-only by design, not an oversight).
export const WithToastFeedback: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:8px; max-width:320px;">
      <dc-paste-rows-zone
        placeholder="📋 Paste rows from Excel or Word"
        @rows=${(e: CustomEvent<{ rows: string[][]; skippedEmpty: number }>) => {
          const root = (e.target as HTMLElement).getRootNode() as ShadowRoot | Document
          const toast = root.querySelector<DcToast>('#paste-feedback')!
          const { rows, skippedEmpty } = e.detail
          toast.message =
            skippedEmpty > 0
              ? `Imported ${rows.length} rows, skipped ${skippedEmpty} blank`
              : `Imported ${rows.length} rows`
          toast.hidden = false
        }}
      ></dc-paste-rows-zone>
      <dc-toast
        id="paste-feedback"
        variant="success"
        dismiss-label="Dismiss"
        hidden
        @dismiss=${(e: Event) => {
          ;(e.target as HTMLElement).hidden = true
        }}
      ></dc-toast>
    </div>
  `,
}
