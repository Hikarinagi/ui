import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import Image from './Image.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
  vi.restoreAllMocks()
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
  it('懒加载时骨架铺满外框,图片在其上层淡入', () => {
    const w = mountImage({ src: PIXEL, fit: 'contain', ratio: 2, class: 'w-40' })
    const img = w.find('img').element as HTMLElement
    const layer = (w.element.querySelector('.hn-skeleton') as HTMLElement).parentElement!
    const host = (w.element as HTMLElement).getBoundingClientRect()
    const box = layer.getBoundingClientRect()

    expect(Math.round(box.width)).toBe(Math.round(host.width))
    expect(Math.round(box.height)).toBe(Math.round(host.height))

    expect(getComputedStyle(layer).position).toBe('absolute')
    expect(getComputedStyle(img).position).toBe('relative')
    expect(getComputedStyle(img).zIndex).toBe('10')
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

it.each([true, false])('懒加载图片淡入,独立于骨架是否开启 skeleton=%s', async skeleton => {
  const w = mountImage({ src: PIXEL, skeleton, class: 'h-20 w-20' })
  const img = w.find('img').element as HTMLImageElement
  let imageFade: Animation | undefined
  let skeletonFade: Animation | undefined
  await vi.waitFor(() => {
    imageFade = img.getAnimations().find(animation => animation instanceof CSSTransition)
    expect(imageFade).toBeTruthy()
    imageFade!.pause()
    if (skeleton) {
      const layer = w.element.querySelector('.hn-skeleton')?.parentElement
      skeletonFade = layer?.getAnimations()[0]
      expect(skeletonFade).toBeTruthy()
      skeletonFade!.pause()
    }
  })
  expect(imageFade!.effect!.getTiming().duration).toBe(300)
  imageFade!.currentTime = 100
  expect(Number(getComputedStyle(img).opacity)).toBeGreaterThan(0)
  expect(Number(getComputedStyle(img).opacity)).toBeLessThan(1)
  if (skeletonFade) {
    expect(skeletonFade.effect!.getTiming().duration).toBe(200)
    skeletonFade.currentTime = 100
    const layer = w.element.querySelector('.hn-skeleton')!.parentElement!
    expect(Number(getComputedStyle(layer).opacity)).toBeGreaterThan(0)
    expect(Number(getComputedStyle(layer).opacity)).toBeLessThan(1)
    skeletonFade.finish()
  }
  imageFade!.finish()
  await vi.waitFor(() => expect(w.element.querySelector('.hn-skeleton')).toBeNull())
  expect(getComputedStyle(img).opacity).toBe('1')
})

it('等待淡入开始时换源,上一张图片的动画不会提前揭示新图', async () => {
  let finishDecode: (() => void) | undefined
  vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
    this: HTMLImageElement,
  ) {
    return this.src.endsWith('#second')
      ? new Promise<void>(resolve => {
          finishDecode = resolve
        })
      : Promise.resolve()
  })
  const src = ref(PIXEL)
  const w = mount(
    {
      setup: () => () =>
        h(Image, {
          src: src.value,
          class: 'h-20 w-20',
          onLoad: () => {
            src.value = PIXEL + '#second'
          },
        }),
    },
    { attachTo: attach() },
  )
  mounted.push(w)
  await vi.waitFor(() => expect(finishDecode).toBeTypeOf('function'))
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )
  const img = w.find('img').element as HTMLImageElement
  expect(getComputedStyle(img).opacity).toBe('0')
  expect(w.element.querySelector('.hn-skeleton')).not.toBeNull()
  finishDecode!()
  await vi.waitFor(() => expect(getComputedStyle(img).opacity).toBe('1'))
})
