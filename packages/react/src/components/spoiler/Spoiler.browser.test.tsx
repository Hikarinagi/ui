import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Spoiler } from './Spoiler'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('Spoiler · Houdini 噪声路径', () => {
  it('隐藏态:paint 背景生效 · 内容被 iris 收起', async () => {
    const w = await mount(<Spoiler>真凶是园丁</Spoiler>)
    const el = w.element

    await vi.waitFor(() => expect(getComputedStyle(el).backgroundImage).toContain('paint'))
    const inner = el.querySelector('.hn-spoiler-inner')!
    expect(getComputedStyle(inner).opacity).toBe('0')
    expect(el.getAttribute('aria-expanded')).toBe('false')
  })

  it('点击揭示:内容 iris 展开、粒子进入停机、再点隐藏 —— 有进必有出', async () => {
    const w = await mount(<Spoiler>真凶是园丁</Spoiler>)
    const el = w.element
    const inner = el.querySelector('.hn-spoiler-inner')!

    await userEvent.click(el)
    expect(el.getAttribute('aria-expanded')).toBe('true')
    await vi.waitFor(() => expect(Number(getComputedStyle(inner).opacity)).toBe(1))
    expect(el.style.getPropertyValue('--hn-nz-stop')).not.toBe('')

    await userEvent.click(el)
    expect(el.getAttribute('aria-expanded')).toBe('false')
    const midway = Number(getComputedStyle(inner).opacity)
    expect(midway).toBeGreaterThan(0)
    await vi.waitFor(() => expect(Number(getComputedStyle(inner).opacity)).toBe(0))

    expect(el.style.getPropertyValue('--hn-nz-stop')).toBe('')
    const t1 = Number(el.style.getPropertyValue('--hn-nz-t'))
    await vi.waitFor(() => {
      expect(Number(el.style.getPropertyValue('--hn-nz-t'))).toBeGreaterThan(t1)
    })
  })

  it('iris 从点击位置展开 —— 与波纹「从触点生长」同一条原则', async () => {
    const w = await mount(<Spoiler>真凶是园丁,证据在温室的第三块砖下面</Spoiler>)
    const el = w.element
    const rect = el.getBoundingClientRect()

    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: rect.left + 2,
        clientY: rect.top + rect.height / 2,
      }),
    )
    await vi.waitFor(() => expect(el.getAttribute('aria-expanded')).toBe('true'))
    const x = Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))
    expect(x).toBeGreaterThanOrEqual(0)
    expect(x).toBeLessThan(20)
  })

  it('跨行剧透:触点映射到 slice 虚拟长线坐标系,首行头≈0%、末行尾≈100%', async () => {
    const narrow = await mount(
      <div style={{ width: '120px' }}>
        <Spoiler>这是一段一定会在窄容器里折行的很长很长的剧透内容</Spoiler>
      </div>,
    )
    const el = narrow.element.firstElementChild as HTMLElement
    const rects = [...el.getClientRects()]
    expect(rects.length).toBeGreaterThan(1)

    const first = rects[0]!
    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: first.left + 2,
        clientY: first.top + first.height / 2,
      }),
    )
    await vi.waitFor(() => expect(el.getAttribute('aria-expanded')).toBe('true'))
    expect(Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))).toBeLessThan(10)

    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => expect(el.getAttribute('aria-expanded')).toBe('false'))

    const last = rects[rects.length - 1]!
    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: last.right - 2,
        clientY: last.top + last.height / 2,
      }),
    )
    await vi.waitFor(() => expect(el.getAttribute('aria-expanded')).toBe('true'))
    expect(Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))).toBeGreaterThan(90)
  })

  it('键盘 Enter / Space 均可揭示', async () => {
    const w = await mount(<Spoiler>秘密</Spoiler>)
    await userEvent.tab()
    expect(document.activeElement).toBe(w.element)

    await userEvent.keyboard('{Enter}')
    expect(w.element.getAttribute('aria-expanded')).toBe('true')
    await userEvent.keyboard(' ')
    expect(w.element.getAttribute('aria-expanded')).toBe('false')
  })

  it('hover 模式:进出即显隐,iris 从鼠标进入点展开', async () => {
    const w = await mount(<Spoiler revealOn="hover">主角最终没有回到现实世界</Spoiler>)
    const el = w.element
    const rect = el.getBoundingClientRect()

    el.dispatchEvent(
      new MouseEvent('mouseenter', {
        clientX: rect.right - 2,
        clientY: rect.top + rect.height / 2,
      }),
    )
    await vi.waitFor(() => expect(el.getAttribute('aria-expanded')).toBe('true'))
    const x = Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))
    expect(x).toBeGreaterThan(80)

    await userEvent.hover(el)
    await userEvent.unhover(el)
    expect(el.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('Spoiler · fallback 路径(站内同款)', () => {
  it('隐藏 = subtle 底 + 内容模糊,点击后模糊解除', async () => {
    const w = await mount(<Spoiler forceFallback>真凶是园丁</Spoiler>)
    const el = w.element
    const inner = el.querySelector('span')!

    expect(getComputedStyle(el).backgroundImage).not.toContain('paint')
    expect(getComputedStyle(el).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(inner).filter).toContain('blur')

    await userEvent.click(el)
    await vi.waitFor(() => expect(getComputedStyle(inner).filter).toBe('none'))
  })
})
