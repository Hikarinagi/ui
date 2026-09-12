import { afterEach, expect, it, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, ref } from 'vue'
import Lightbox from './Lightbox.vue'
import type { LightboxItem } from './types'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
const urls: string[] = []

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  for (const url of urls.splice(0)) URL.revokeObjectURL(url)
  document.body.innerHTML = ''
})

it('Lightbox 接受无来源节点的 blob 条目并同步受控状态', async () => {
  await page.viewport(1024, 768)
  const sources = [
    [400, 200],
    [200, 400],
  ].map(([width, height]) => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '"><rect width="100%" height="100%" fill="#39c5bb"/></svg>'
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    urls.push(url)
    return url
  })
  const items = ref<LightboxItem[]>([])
  const open = ref(false)
  const index = ref(0)
  wrapper = mount(
    {
      setup: () => () =>
        h(Lightbox, {
          items: items.value,
          open: open.value,
          index: index.value,
          'onUpdate:open': value => {
            open.value = value
          },
          'onUpdate:index': value => {
            index.value = value
          },
        }),
    },
    { attachTo: document.body },
  )
  expect(document.querySelector('img')).toBeNull()
  items.value = sources.map((src, at) => ({ id: String(at), src, alt: '图片 ' + (at + 1) }))
  index.value = 1
  open.value = true
  const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null
  const currentImage = () =>
    dialog()?.querySelector('[data-hn-frame][class*="cursor-"] img') as HTMLImageElement | null
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(currentImage()?.naturalWidth).toBe(200)
    expect(currentImage()?.src).toBe(sources[1])
  })
  await userEvent.keyboard('{ArrowLeft}')
  await vi.waitFor(() => expect(index.value).toBe(0))
  await vi.waitFor(() => expect(currentImage()?.src).toBe(sources[0]))
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(open.value).toBe(false))
  await vi.waitFor(() => expect(dialog()).toBeNull())
  open.value = true
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(currentImage()?.naturalWidth).toBe(400)
  })
  open.value = false
  await vi.waitFor(() => expect(dialog()).toBeNull())
})

it.each(['Escape', '下滑'])(
  '独立 Lightbox 从 source 展开,%s关闭时回到来源的当前位置',
  async method => {
    await page.viewport(1024, 768)
    const source = document.createElement('img')
    source.src =
      'data:image/svg+xml,' +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"/>')
    source.style.cssText =
      'position:fixed;left:80px;top:64px;width:160px;height:80px;border-radius:8px'
    document.body.appendChild(source)
    await vi.waitFor(() => expect(source.naturalWidth).toBe(400))
    wrapper = mount(Lightbox, {
      props: {
        items: [{ id: 'source', src: source.src, alt: '来源图片', source: () => source }],
        open: false,
      },
      attachTo: document.body,
    })
    const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null
    const frame = () =>
      dialog()?.querySelector('[data-hn-frame][class*="cursor-"]') as HTMLElement | null
    const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    const rects: DOMRect[] = []
    let rounded = false
    const sample = () => {
      const el = frame()
      if (!el) return
      rects.push(el.getBoundingClientRect())
      rounded ||= /round (?!0px)[\d.]+px/.test(getComputedStyle(el).clipPath)
    }
    const gap = (rect: DOMRect, target: DOMRect) =>
      Math.hypot(
        rect.x + rect.width / 2 - target.x - target.width / 2,
        rect.y + rect.height / 2 - target.y - target.height / 2,
      )
    const origin = source.getBoundingClientRect()
    await wrapper.setProps({ open: true })
    while (dialog()?.dataset.hnPhase !== 'open') {
      sample()
      await nextFrame()
    }
    expect(Math.min(...rects.map(rect => gap(rect, origin)))).toBeLessThan(8)
    expect(Math.min(...rects.map(rect => rect.width))).toBeLessThan(200)
    expect(frame()!.getBoundingClientRect().width).toBeCloseTo(1024, 0)
    expect(rounded).toBe(true)
    source.style.left = '280px'
    source.style.top = '160px'
    const destination = source.getBoundingClientRect()
    rects.length = 0
    rounded = false
    if (method === 'Escape') {
      await userEvent.keyboard('{Escape}')
    } else {
      const pointer = (type: string, target: HTMLElement, y: number) =>
        target.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: 512,
            clientY: y,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true,
            button: 0,
            buttons: type === 'pointerup' ? 0 : 1,
          }),
        )
      pointer('pointerdown', frame()!, 384)
      for (let step = 1; step <= 6; step += 1) {
        pointer('pointermove', dialog()!, 384 + step * 30)
        await nextFrame()
      }
      pointer('pointerup', dialog()!, 564)
    }
    while (dialog()) {
      sample()
      await nextFrame()
    }
    expect(rects.length).toBeGreaterThan(2)
    expect(gap(rects.at(-1)!, destination)).toBeLessThan(4)
    expect(rects.at(-1)!.width).toBeCloseTo(destination.width, 0)
    expect(rounded).toBe(true)
    expect(wrapper.emitted('update:open')).toContainEqual([false])
  },
)
