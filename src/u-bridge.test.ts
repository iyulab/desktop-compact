import { expect } from '@open-wc/testing'

// u-bridge.css paints the `--u-` components with desktop-compact's tokens: what the u tokens resolve to on
// :root is the desktop-compact value, light and dark, while the app's own unlayered CSS still wins.
describe('u-bridge.css', () => {
  const sheets: HTMLElement[] = []
  const load = (href: string) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    const loaded = new Promise((resolve, reject) => {
      link.addEventListener('load', resolve)
      link.addEventListener('error', reject)
    })
    document.head.append(link)
    sheets.push(link)
    return loaded
  }
  /** The color a `--u-` token paints with, as the page computes it. */
  const painted = (token: string) => {
    const probe = document.createElement('div')
    probe.style.color = `var(${token})`
    document.body.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  }

  before(async () => {
    // A u default the bridge must win over, as the u tokens' own sheet would set it in its layer.
    const base = document.createElement('style')
    base.textContent = '@layer iyu.base, iyu.house; @layer iyu.base { :root { --u-bg-color: rgb(1, 2, 3); --u-txt-color: rgb(1, 2, 3); } }'
    document.head.append(base)
    sheets.push(base)
    await load('/tokens.css')
    await load('/u-bridge.css')
  })

  after(() => {
    for (const sheet of sheets) sheet.remove()
    document.documentElement.removeAttribute('data-theme')
  })

  it('points the u tokens at desktop-compact, over the u defaults', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    expect(painted('--u-bg-color')).to.equal('rgb(255, 255, 255)')
    expect(painted('--u-txt-color')).to.equal('rgb(26, 26, 30)')
    expect(painted('--u-primary-color')).to.equal('rgb(37, 99, 235)')
    expect(painted('--u-neutral-0')).to.equal('rgb(255, 255, 255)')
  })

  it('follows desktop-compact into dark', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    expect(painted('--u-bg-color')).to.equal('rgb(23, 24, 28)')
    expect(painted('--u-txt-color')).to.equal('rgb(240, 240, 242)')
    expect(painted('--u-neutral-0')).to.equal('rgb(23, 24, 28)')
  })

  it("leaves the app's own unlayered CSS the last word", () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const own = document.createElement('style')
    own.textContent = ':root { --u-bg-color: rgb(4, 5, 6); }'
    document.head.append(own)
    try {
      expect(painted('--u-bg-color')).to.equal('rgb(4, 5, 6)')
    } finally {
      own.remove()
    }
  })
})
