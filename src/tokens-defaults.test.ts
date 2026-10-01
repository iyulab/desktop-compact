import { fixtureSync, html, expect } from '@open-wc/testing'
import './components/card/dc-card.js'
import './components/badge/dc-badge.js'
import './components/section-heading/dc-section-heading.js'
import type { DcCard } from './components/card/dc-card.js'
import type { DcBadge } from './components/badge/dc-badge.js'
import type { DcSectionHeading } from './components/section-heading/dc-section-heading.js'

// With the package's tokens.css loaded — as every consuming app has it — the parts look as they did
// in 0.9.1: the role tokens added in 0.10 must default to the old look. The wrappers are mounted with
// fixtureSync: fixture() would wait for an animation frame, which a background test page may not get.
describe('tokens.css defaults keep the 0.9 look', () => {
  let link: HTMLLinkElement

  before(async () => {
    link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/tokens.css'
    const loaded = new Promise((resolve, reject) => {
      link.addEventListener('load', resolve)
      link.addEventListener('error', reject)
    })
    document.head.append(link)
    await loaded
  })

  after(() => link.remove())

  it('dc-card', async () => {
    const card = fixtureSync<DcCard>(html`<dc-card>Body</dc-card>`)
    await card.updateComplete
    const s = getComputedStyle(card)
    expect(s.backgroundColor).to.equal('rgb(247, 247, 248)')
    expect(s.borderTopWidth).to.equal('1px')
    expect(s.borderTopColor).to.equal('rgb(226, 226, 228)')
    expect(s.borderTopLeftRadius).to.equal('6px')
    expect(s.boxShadow).to.equal('none')
  })

  it('dc-badge accent ground is the 15% tint of the accent', async () => {
    const el = fixtureSync<DcBadge>(html`<dc-badge variant="accent">x</dc-badge>`)
    await el.updateComplete
    const probe = fixtureSync<HTMLSpanElement>(html`<span style="background: color-mix(in srgb, #2563eb 15%, transparent)"></span>`)
    expect(getComputedStyle(el.shadowRoot!.querySelector('span')!).backgroundColor).to.equal(getComputedStyle(probe).backgroundColor)
  })

  it('dc-section-heading', async () => {
    const el = fixtureSync<DcSectionHeading>(html`<dc-section-heading heading="A" description="B"></dc-section-heading>`)
    await el.updateComplete
    expect(getComputedStyle(el.shadowRoot!.querySelector('h3')!).fontWeight).to.equal('600')
    // The muted description color is the one deliberate change since 0.9: darker, for contrast.
    expect(getComputedStyle(el.shadowRoot!.querySelector('p')!).color).to.equal('rgb(104, 104, 112)')
  })

  // WCAG 2 relative luminance and contrast ratio of two `rgb(r, g, b)` colors.
  const luminance = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.slice(0, 3).map((v) => {
      const c = Number(v) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  const token = (name: string) => {
    const probe = fixtureSync<HTMLSpanElement>(html`<span style="color: var(${name})"></span>`)
    return getComputedStyle(probe).color
  }

  for (const theme of ['light', 'dark']) {
    it(`muted text reads at 4.5:1 or more on the ${theme} grounds`, () => {
      document.documentElement.dataset.theme = theme
      try {
        const muted = token('--dc-color-text-muted')
        for (const ground of ['--dc-color-bg', '--dc-color-surface', '--dc-color-surface-hover']) {
          expect(contrast(muted, token(ground)), `${muted} on ${ground}`).to.be.at.least(4.5)
        }
      } finally {
        delete document.documentElement.dataset.theme
      }
    })
  }
})
