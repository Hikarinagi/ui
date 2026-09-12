import { afterEach, expect, it, vi } from 'vitest'
import { page } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Lightbox from './Lightbox.vue'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const frame = () =>
  dialog()?.querySelector('[data-hn-frame][class*="cursor-"]') as HTMLElement | null
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

function pointer(type: string, target: HTMLElement, y: number) {
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
}

it.each(['无来源', '来源已移除'])('%s时下滑关闭从当前大小淡出,松手后不反向放大', async mode => {
  await page.viewport(1024, 768)
  const src =
    'data:image/svg+xml,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"/>')
  const source = document.createElement('img')
  source.src = src
  source.style.cssText = 'width:160px;height:80px'
  if (mode === '来源已移除') {
    document.body.appendChild(source)
    await vi.waitFor(() => expect(source.naturalWidth).toBe(400))
  }
  wrapper = mount(Lightbox, {
    props: {
      open: true,
      items: [{ id: 'image', src, alt: '图片', source: () => source }],
    },
    attachTo: document.body,
  })
  await vi.waitFor(() => {
    expect(dialog()?.dataset.hnPhase).toBe('open')
    expect(frame()?.querySelector('img')?.naturalWidth).toBe(400)
  })
  source.remove()
  const scale = () => new DOMMatrix(getComputedStyle(frame()!).transform).a
  pointer('pointerdown', frame()!, 384)
  for (let step = 1; step <= 6; step += 1) {
    pointer('pointermove', dialog()!, 384 + step * 30)
    await nextFrame()
  }
  const released = scale()
  expect(released).toBeLessThan(0.85)
  pointer('pointerup', dialog()!, 564)
  await nextTick()
  expect(dialog()?.dataset.hnPhase).toBe('closing')
  const samples: number[] = []
  while (frame()) {
    samples.push(scale())
    await nextFrame()
  }
  expect(samples.length).toBeGreaterThan(2)
  expect(Math.max(...samples)).toBeLessThanOrEqual(released + 0.01)
  expect(wrapper.emitted('update:open')).toContainEqual([false])
})
