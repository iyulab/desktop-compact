/**
 * Whether a modal is open: one of this library's dialogs, or anything else that says so with
 * {@link setModalOpen}. The platform's `:modal` cannot be asked across shadow roots, so an app that
 * keeps its keyboard shortcuts quiet while a dialog is open would otherwise search every shadow
 * root for one.
 */

const open = new Set<object>()

/** Whether a modal is open now. */
export function isModalOpen(): boolean {
  return open.size > 0
}

/**
 * Marks `owner` — a component, or any object standing for a modal — as open or closed. Whenever
 * {@link isModalOpen} changes, `document` fires `dc-modal-change` with `{ open }` in its detail.
 */
export function setModalOpen(owner: object, isOpen: boolean): void {
  const before = open.size > 0
  if (isOpen) open.add(owner)
  else open.delete(owner)
  const now = open.size > 0
  if (before !== now && typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('dc-modal-change', { detail: { open: now } }))
  }
}

declare global {
  interface DocumentEventMap {
    'dc-modal-change': CustomEvent<{ open: boolean }>
  }
}
