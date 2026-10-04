import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { PrevNext } from './PrevNext'
import { PrevNextLink } from './PrevNextLink'
import { Text } from '../text/Text'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

async function harness(width = 720) {
  const w = await mount(
    <PrevNext>
      <PrevNextLink direction="prev" href="#a">
        排版与字阶
      </PrevNextLink>
      <PrevNextLink direction="next" href="#b">
        Button 按钮
      </PrevNextLink>
    </PrevNext>,
  )
  w.container.style.cssText = `width: ${width}px`
  return w
}

describe('prev-next · 上下页导航', () => {
  it('两张 surface 卡并排;窄屏落成单列', async () => {
    await page.viewport(900, 600)
    const w = await harness()
    const [prev, next] = [...w.element.querySelectorAll('a')]
    expect(
      Math.abs(prev!.getBoundingClientRect().top - next!.getBoundingClientRect().top),
    ).toBeLessThan(2)
    expect(getComputedStyle(prev!).boxShadow).not.toBe('none')

    await page.viewport(414, 800)
    const narrow = await harness(380)
    const [p2, n2] = [...narrow.element.querySelectorAll('a')]
    expect(n2!.getBoundingClientRect().top).toBeGreaterThan(p2!.getBoundingClientRect().bottom - 1)
  })

  it('整卡是可点容器:hover 浮薄墨、Tab 可达、焦点环可见', async () => {
    await page.viewport(900, 600)
    const w = await harness()
    const prev = w.element.querySelector('a')!
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
      const directions = single ? (['next'] as const) : (['prev', 'next'] as const)
      const title = 'ChapterWithoutWordBreaks'.repeat(16)
      const w = await mount(
        <PrevNext dir={dir}>
          {directions.map(direction => (
            <PrevNextLink key={direction} direction={direction} href={`#${direction}`}>
              <Text truncate>{title}</Text>
            </PrevNextLink>
          ))}
        </PrevNext>,
      )
      w.container.style.cssText = 'width: calc(100% - 32px); max-width: 720px; margin-inline: auto'
      const nav = w.element
      const bounds = nav.getBoundingClientRect()
      const links = [...w.element.querySelectorAll('a')]
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
