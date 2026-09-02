import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './dc-context-menu.js'
import type { DcContextMenu } from './dc-context-menu.js'

const meta: Meta = {
  title: 'Primitives/ContextMenu',
  component: 'dc-context-menu',
}
export default meta

type Story = StoryObj

const ITEMS = [
  { value: 'rename', label: 'Rename', icon: '✎' },
  { value: 'duplicate', label: 'Duplicate', icon: '⧉' },
  { separator: true },
  { value: 'archive', label: 'Archive', icon: '🗄', disabled: true },
  { value: 'delete', label: 'Delete', icon: '🗑', danger: true },
]

export const Default: Story = {
  render: () => html`
    <div
      style="width:320px; height:200px; border:1px dashed var(--dc-color-border, #e2e2e4); display:flex; align-items:center; justify-content:center; font-family:system-ui;"
      @contextmenu=${(e: MouseEvent) => {
        e.preventDefault()
        const root = (e.target as HTMLElement).getRootNode() as ShadowRoot | Document
        const menu = root.querySelector<DcContextMenu>('#demo-menu')!
        menu.x = e.clientX
        menu.y = e.clientY
        menu.open = true
      }}
    >
      Right-click here
    </div>
    <dc-context-menu
      id="demo-menu"
      aria-label="Row actions"
      .items=${ITEMS}
      @select=${(e: CustomEvent) => console.log('selected', e.detail)}
    ></dc-context-menu>
  `,
}
