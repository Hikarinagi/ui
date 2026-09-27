import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import PrevNext from './PrevNext.vue'
import PrevNextLink from './PrevNextLink.vue'
import Text from '../text/Text.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(width = 720) {
  const host = document.createElement('div')
  host.style.cssText = `width: ${width}px`
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(PrevNext, {}, () => [
          h(PrevNextLink, { direction: 'prev', href: '#a' }, () => '排版与字阶'),
          h(PrevNextLink, { direction: 'next', href: '#b' }, () => 'Button 按钮'),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

describe('prev-next · 上下页导航', () => {
  it('两张 surface 卡并排;窄屏落成单列', async () => {
    await page.viewport(900, 600)
    const w = harness()
    const [prev, next] = w.findAll('a').map(l => l.element as HTMLElement)
    expect(
      Math.abs(prev!.getBoundingClientRect().top - next!.getBoundingClientRect().top),
    ).toBeLessThan(2)
    expect(getComputedStyle(prev!).boxShadow).not.toBe('none')

    await page.viewport(414, 800)
    const narrow = harness(380)
    const [p2, n2] = narrow.findAll('a').map(l => l.element as HTMLElement)
    expect(n2!.getBoundingClientRect().top).toBeGreaterThan(p2!.getBoundingClientRect().bottom - 1)
  })

  it('整卡是可点容器:hover 浮薄墨、Tab 可达、焦点环可见', async () => {
    await page.viewport(900, 600)
    const w = harness()
    const prev = w.find('a').element as HTMLElement
    expect(getComputedStyle(prev, '::after').opacity).toBe('0')
    await userEvent.hover(prev)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(prev, '::after').opacity)).toBeGreaterThan(0),
    )
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(prev)
  })

  it.each(
    [414, 900].flatMap(viewport =>
      (['ltr', 'rtl'] as const).flatMap(dir =>
        [false, true].map(single => ({ viewport, dir, single })),
      ),
    ),
  )(
    'keeps long titles inside cards ($viewport px, $dir, single=$single)',
    async ({ viewport, dir, single }) => {
      await page.viewport(viewport, 800)
      const host = document.createElement('div')
      host.style.cssText = 'width: calc(100% - 32px); max-width: 720px; margin-inline: auto'
      document.body.appendChild(host)
      const directions = single ? (['next'] as const) : (['prev', 'next'] as const)
      const title = 'ChapterWithoutWordBreaks'.repeat(16)
      const w = mount(
        defineComponent({
          setup: () => () =>
            h(PrevNext, { dir }, () =>
              directions.map(direction =>
                h(PrevNextLink, { direction, href: `#${direction}` }, () =>
                  h(Text, { truncate: true }, () => title),
                ),
              ),
            ),
        }),
        { attachTo: host },
      )
      mounted.push(w)
      const nav = w.get('nav').element as HTMLElement
      const bounds = nav.getBoundingClientRect()
      const links = w.findAll('a').map(link => link.element as HTMLElement)
      const gap = parseFloat(getComputedStyle(nav).columnGap)
      const expectedWidth = viewport < 640 ? bounds.width : (bounds.width - gap) / 2

      for (const link of links) {
        const card = link.getBoundingClientRect()
        expect(Math.abs(card.width - expectedWidth)).toBeLessThan(1)
        expect(card.left).toBeGreaterThanOrEqual(bounds.left - 1)
        expect(card.right).toBeLessThanOrEqual(bounds.right + 1)
        const text = link.querySelector('p')!
        const content = text.parentElement!
        const style = getComputedStyle(link)
        const left = card.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft)
        const right =
          card.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight)
        expect(content.getBoundingClientRect().left).toBeGreaterThanOrEqual(left - 1)
        expect(content.getBoundingClientRect().right).toBeLessThanOrEqual(right + 1)
        expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
        expect(getComputedStyle(text).textOverflow).toBe('ellipsis')
        expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth + 1)
        expect(text.textContent).toBe(title)
      }
      if (links.length === 2) {
        const [prev, next] = links.map(link => link.getBoundingClientRect())
        if (viewport < 640) expect(next!.top).toBeGreaterThan(prev!.bottom)
        else expect(next!.top).toBe(prev!.top)
      } else if (viewport >= 640) {
        const next = links[0]!.getBoundingClientRect()
        expect(
          Math.abs(dir === 'ltr' ? next.right - bounds.right : next.left - bounds.left),
        ).toBeLessThan(1)
      }
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      )
    },
  )
})
