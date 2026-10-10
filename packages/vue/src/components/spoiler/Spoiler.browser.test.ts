import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Spoiler from './Spoiler.vue'
import { SPOILER_WORKLET_INPUTS } from './SpoilerPainter'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('Spoiler · Houdini 噪声路径', () => {
  it('隐藏态:paint 背景生效 · 内容被 iris 收起', async () => {
    const w = mount(Spoiler, { slots: { default: () => '真凶是园丁' }, attachTo: attach() })
    const el = w.element as HTMLElement

    await vi.waitFor(() => expect(getComputedStyle(el).backgroundImage).toContain('paint'))
    const inner = el.querySelector('.hn-spoiler-inner')!
    expect(getComputedStyle(inner).opacity).toBe('0')
    expect(w.attributes('aria-expanded')).toBe('false')
  })

  it('点击揭示:内容 iris 展开、粒子进入停机、再点隐藏 —— 有进必有出', async () => {
    const w = mount(Spoiler, { slots: { default: () => '真凶是园丁' }, attachTo: attach() })
    const el = w.element as HTMLElement
    const inner = el.querySelector('.hn-spoiler-inner')!

    await userEvent.click(el)
    expect(w.attributes('aria-expanded')).toBe('true')
    await vi.waitFor(() => expect(Number(getComputedStyle(inner).opacity)).toBe(1))
    expect(el.style.getPropertyValue('--hn-nz-stop')).not.toBe('Infinity')

    await userEvent.click(el)
    expect(w.attributes('aria-expanded')).toBe('false')
    const midway = Number(getComputedStyle(inner).opacity)
    expect(midway).toBeGreaterThan(0)
    await vi.waitFor(() => expect(Number(getComputedStyle(inner).opacity)).toBe(0))

    expect(el.style.getPropertyValue('--hn-nz-stop')).toBe('Infinity')
    const t1 = Number(getComputedStyle(el).getPropertyValue('--hn-nz-t'))
    await vi.waitFor(() => {
      expect(Number(getComputedStyle(el).getPropertyValue('--hn-nz-t'))).toBeGreaterThan(t1)
    })
  })

  it('iris 从点击位置展开 —— 与波纹「从触点生长」同一条原则', async () => {
    const w = mount(Spoiler, {
      slots: { default: () => '真凶是园丁,证据在温室的第三块砖下面' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const rect = el.getBoundingClientRect()

    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: rect.left + 2,
        clientY: rect.top + rect.height / 2,
      }),
    )
    await vi.waitFor(() => expect(w.attributes('aria-expanded')).toBe('true'))
    const x = Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))
    expect(x).toBeGreaterThanOrEqual(0)
    expect(x).toBeLessThan(20)
  })

  it('跨行剧透:触点映射到 slice 虚拟长线坐标系,首行头≈0%、末行尾≈100%', async () => {
    const narrow = document.createElement('div')
    narrow.style.width = '120px'
    document.body.appendChild(narrow)
    const w = mount(Spoiler, {
      slots: { default: () => '这是一段一定会在窄容器里折行的很长很长的剧透内容' },
      attachTo: narrow,
    })
    const el = w.element as HTMLElement
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
    await vi.waitFor(() => expect(w.attributes('aria-expanded')).toBe('true'))
    expect(Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))).toBeLessThan(10)

    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => expect(w.attributes('aria-expanded')).toBe('false'))

    const last = rects[rects.length - 1]!
    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        clientX: last.right - 2,
        clientY: last.top + last.height / 2,
      }),
    )
    await vi.waitFor(() => expect(w.attributes('aria-expanded')).toBe('true'))
    expect(Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))).toBeGreaterThan(90)
  })

  it('键盘 Enter / Space 均可揭示', async () => {
    const w = mount(Spoiler, { slots: { default: () => '秘密' }, attachTo: attach() })
    await userEvent.tab()
    expect(document.activeElement).toBe(w.element)

    await userEvent.keyboard('{Enter}')
    expect(w.attributes('aria-expanded')).toBe('true')
    await userEvent.keyboard(' ')
    expect(w.attributes('aria-expanded')).toBe('false')
  })

  it('hover 模式:进出即显隐,iris 从鼠标进入点展开', async () => {
    const w = mount(Spoiler, {
      props: { revealOn: 'hover' },
      slots: { default: () => '主角最终没有回到现实世界' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const rect = el.getBoundingClientRect()

    el.dispatchEvent(
      new MouseEvent('mouseenter', {
        clientX: rect.right - 2,
        clientY: rect.top + rect.height / 2,
      }),
    )
    await vi.waitFor(() => expect(w.attributes('aria-expanded')).toBe('true'))
    const x = Number.parseFloat(el.style.getPropertyValue('--hn-iris-x'))
    expect(x).toBeGreaterThan(80)

    await userEvent.hover(el)
    await userEvent.unhover(el)
    expect(w.attributes('aria-expanded')).toBe('false')
  })
})

describe('Spoiler · 噪声的开销', () => {
  const frame = () => new Promise(requestAnimationFrame)
  const clock = (el: Element) => el.getAnimations()[0]!

  it('时钟由动画驱动,不占用 requestAnimationFrame;worklet 的每个输入属性都有值', async () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('div', { style: 'width: 640px' }, [
            h(Spoiler, null, () => '真凶是园丁'),
            h(Spoiler, { class: 'block' }, () => '真凶是园丁'),
            h(Spoiler, { class: 'block h-80' }, () => '真凶是园丁'),
          ]),
      }),
      { attachTo: attach() },
    )
    const hosts = Array.from(
      (w.element as HTMLElement).querySelectorAll<HTMLElement>('[data-hidden]'),
    )
    await vi.waitFor(() =>
      expect(hosts.map(el => clock(el)?.playState)).toEqual(Array(3).fill('running')),
    )
    raf.mockClear()
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(raf).not.toHaveBeenCalled()
    raf.mockRestore()
    for (const el of hosts)
      for (const name of SPOILER_WORKLET_INPUTS)
        expect(getComputedStyle(el).getPropertyValue(name).trim(), name).not.toBe('')
    w.unmount()
  })

  it('离开视口时时钟暂停,回到视口后继续;揭示并淡出后停下', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('div', { 'data-scroller': '', style: 'height: 200px; overflow: auto' }, [
            h('div', { style: 'height: 1200px' }),
            h(Spoiler, null, () => '真凶是园丁'),
            h('div', { style: 'height: 400px' }),
          ]),
      }),
      { attachTo: attach() },
    )
    const scroller = w.element as HTMLElement
    const el = scroller.querySelector<HTMLElement>('[data-hidden]')!
    await frame()
    await vi.waitFor(() => expect(clock(el).playState).toBe('paused'))

    scroller.scrollTop = 1100
    await vi.waitFor(() => expect(clock(el).playState).toBe('running'))
    scroller.scrollTop = 0
    await vi.waitFor(() => expect(clock(el).playState).toBe('paused'))

    scroller.scrollTop = 1100
    await vi.waitFor(() => expect(clock(el).playState).toBe('running'))
    el.click()
    expect(clock(el).playState).toBe('running')
    await vi.waitFor(() => expect(clock(el).playState).toBe('paused'), { timeout: 4000 })
    w.unmount()
  })
})

describe('Spoiler · fallback 路径(站内同款)', () => {
  it('隐藏 = subtle 底 + 内容模糊,点击后模糊解除', async () => {
    const w = mount(Spoiler, {
      props: { forceFallback: true },
      slots: { default: () => '真凶是园丁' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const inner = el.querySelector('span')!

    expect(getComputedStyle(el).backgroundImage).not.toContain('paint')
    expect(getComputedStyle(el).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(inner).filter).toContain('blur')

    await userEvent.click(el)
    await vi.waitFor(() => expect(getComputedStyle(inner).filter).toBe('none'))
  })
})
