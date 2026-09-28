import { fixtureSync } from '@open-wc/testing'
import type { TemplateResult } from 'lit'

/**
 * Renders a fixture whose root is a plain element (a `<form>`, say) and waits for the custom
 * elements inside it to finish updating.
 *
 * `fixture()` waits for its root's `updateComplete`, and for a root without one it waits for an
 * animation frame instead. Headless Chrome does not always run animation frames for the test page,
 * so a test that waited on a frame could time out; the elements' own update promises are what the
 * test needs.
 */
export async function formFixture<T extends Element>(template: TemplateResult): Promise<T> {
  const root = fixtureSync<T>(template)
  const pending = [...root.querySelectorAll('*')]
    .map((el) => (el as Partial<{ updateComplete: Promise<unknown> }>).updateComplete)
    .filter((p): p is Promise<unknown> => p instanceof Promise)
  await Promise.all(pending)
  return root
}
