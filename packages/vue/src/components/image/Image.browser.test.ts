import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Image from './Image.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

function mountImage(props: Record<string, unknown>) {
  const w = mount(Image, { props, attachTo: attach() })
  mounted.push(w)
  return w
}

describe('image · 加载', () => {
  it('懒加载时骨架盖在图片之上,contain 的留白处也被盖住', () => {
    const w = mountImage({ src: PIXEL, fit: 'contain', ratio: 2, class: 'w-40' })
    const img = w.find('img').element as HTMLElement
    const layer = (w.element.querySelector('.hn-skeleton') as HTMLElement).parentElement!
    const host = (w.element as HTMLElement).getBoundingClientRect()
    const box = layer.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))

    expect(getComputedStyle(layer).position).toBe('absolute')
    expect(getComputedStyle(img).position).toBe('static')
  })

  it('首屏图压在骨架上层,不等脚本就能显示', () => {
    const w = mountImage({ src: PIXEL, lazy: false, class: 'h-20 w-20' })
    const style = getComputedStyle(w.find('img').element as HTMLElement)

    expect(style.position).toBe('relative')
    expect(style.zIndex).toBe('10')
  })

  it('比例容器在图片到位之前就撑住高度', () => {
    const w = mountImage({ src: PIXEL, lazy: false, ratio: 2, class: 'w-40' })
    const box = (w.element as HTMLElement).getBoundingClientRect()
    expect(Math.round(box.width)).toBe(160)
    expect(Math.round(box.height)).toBe(80)
  })

  it('骨架铺满外框,形状交给外框裁', () => {
    const w = mountImage({ src: PIXEL, lazy: false, ratio: 1, class: 'w-24 rounded-lg' })
    const skeleton = w.element.querySelector('.hn-skeleton') as HTMLElement
    const host = (w.element as HTMLElement).getBoundingClientRect()
    const box = skeleton.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))
    expect(getComputedStyle(skeleton).borderTopLeftRadius).toBe('0px')
    expect(getComputedStyle(w.element as HTMLElement).overflow).toBe('hidden')
  })

  it('懒加载的图在骨架期间不绘制,边缘不会透出图片', () => {
    const w = mountImage({ src: PIXEL, ratio: 1, class: 'w-24 rounded-lg' })
    expect(getComputedStyle(w.find('img').element as HTMLElement).opacity).toBe('0')
  })
})

describe('image · 懒加载', () => {
  function mountBelowFold(props: Record<string, unknown>) {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h('div', { style: 'height: 300vh' }),
            h(Image, { src: PIXEL, class: 'block h-20 w-20', ...props }),
          ]),
      }),
      { attachTo: attach() },
    )
    mounted.push(w)
    return w
  }

  it('视口之外的图片占好位置但不带地址,滚到跟前才请求', async () => {
    const w = mountBelowFold({})

    const img = w.find('img')
    expect(img.exists()).toBe(true)
    await vi.waitFor(() => expect(img.attributes('src')).toBeUndefined())

    img.element.scrollIntoView()
    await vi.waitFor(() => expect(w.find('img').attributes('src')).toBe(PIXEL))
    await vi.waitFor(() =>
      expect(getComputedStyle(w.find('img').element as HTMLElement).opacity).toBe('1'),
    )
  })

  it('rootMargin 决定提前量,给够就不必滚到跟前', async () => {
    const w = mountBelowFold({ rootMargin: '9999px' })
    await vi.waitFor(() => expect(w.find('img').attributes('src')).toBe(PIXEL))
  })

  it('lazy 为假时不等观察器,直接请求', () => {
    const w = mountBelowFold({ lazy: false })
    expect(w.find('img').attributes('src')).toBe(PIXEL)
  })
})
