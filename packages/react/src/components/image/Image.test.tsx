import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type { CSSProperties, ReactNode } from 'react'
import { Image, type ImageProps } from './Image'
import { ImageResolverProvider } from './resolver'
import { resetDevWarnings } from '../../lib/dev'

let decodes: Array<'ok' | 'fail'> = []

beforeEach(() => {
  document.body.innerHTML = ''
  decodes = []
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    writable: true,
    value: () =>
      decodes.shift() === 'fail'
        ? Promise.reject(new Error('decode failed'))
        : Promise.resolve(undefined),
  })
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container.firstElementChild as HTMLElement }
}

async function flushPromises() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}

function withResolver(resolver: (src: string) => string, ui: ReactNode) {
  return <ImageResolverProvider resolver={resolver}>{ui}</ImageResolverProvider>
}

describe('地址解析', () => {
  it('没有解析器时原样使用 src', () => {
    const w = mount(<Image src="/a.webp" lazy={false} />)
    expect(w.container.querySelector('img')!.getAttribute('src')).toBe('/a.webp')
  })

  it('解析器收到 src 与用途', () => {
    const resolver = vi.fn((src: string) => `https://cdn.test${src}`)
    const w = mount(withResolver(resolver, <Image src="/a.webp" lazy={false} />))
    expect(resolver).toHaveBeenCalledWith('/a.webp', 'image')
    expect(w.container.querySelector('img')!.getAttribute('src')).toBe('https://cdn.test/a.webp')
  })

  it('回退地址同样经过解析器', async () => {
    decodes = ['fail']
    const resolver = vi.fn((src: string) => src)
    mount(withResolver(resolver, <Image src="/a.webp" fallback="/f.webp" lazy={false} />))
    await flushPromises()
    expect(resolver).toHaveBeenLastCalledWith('/f.webp', 'image')
  })

  it('没有 src 时不解析回退地址,交给空态', () => {
    const resolver = vi.fn((src: string) => src)
    mount(withResolver(resolver, <Image fallback="/f.webp" lazy={false} />))
    expect(resolver).not.toHaveBeenCalled()
  })
})

describe('加载与回退', () => {
  it('加载失败时换到回退图,不报错', async () => {
    decodes = ['fail']
    const onError = vi.fn()
    const w = mount(<Image src="/a.webp" fallback="/f.webp" lazy={false} onError={onError} />)
    await flushPromises()
    await flushPromises()
    expect(w.container.querySelector('img')!.getAttribute('src')).toBe('/f.webp')
    expect(onError).not.toHaveBeenCalled()
  })

  it('回退图也失败才报错', async () => {
    decodes = ['fail', 'fail']
    const onError = vi.fn()
    mount(<Image src="/a.webp" fallback="/f.webp" lazy={false} onError={onError} />)
    await flushPromises()
    await flushPromises()
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('没有回退图时直接报错并渲染 error 插槽', async () => {
    decodes = ['fail']
    const onError = vi.fn()
    const w = mount(<Image src="/a.webp" lazy={false} onError={onError} error={<p>加载失败</p>} />)
    await flushPromises()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(w.element.textContent).toBe('加载失败')
  })

  it('load 事件带出自然尺寸', async () => {
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 800,
    })
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      configurable: true,
      get: () => 600,
    })
    const onLoad = vi.fn()
    mount(<Image src="/a.webp" lazy={false} onLoad={onLoad} />)
    await flushPromises()
    expect(onLoad.mock.calls[0]?.[0]).toEqual({ width: 800, height: 600 })
  })

  it('换 src 之后回退状态重置', async () => {
    decodes = ['fail']
    const w = mount(<Image src="/a.webp" fallback="/f.webp" lazy={false} />)
    await flushPromises()
    expect(w.container.querySelector('img')!.getAttribute('src')).toBe('/f.webp')

    w.rerender(<Image src="/b.webp" fallback="/f.webp" lazy={false} />)
    await flushPromises()
    expect(w.container.querySelector('img')!.getAttribute('src')).toBe('/b.webp')
  })
})

describe('占位与空态', () => {
  it('没有 src 时渲染 empty 插槽,不渲染 img', () => {
    const w = mount(<Image lazy={false} empty={<p>暂无图片</p>} />)
    expect(w.container.querySelector('img')).toBeNull()
    expect(w.element.textContent).toBe('暂无图片')
  })

  it('骨架盖在图片之上,揭示之后撤走', async () => {
    const w = mount(<Image src="/a.webp" lazy={false} />)
    expect(w.container.querySelector('.hn-skeleton')).not.toBeNull()

    const nodes = [...w.element.children].map(el => el.tagName)
    expect(nodes.indexOf('SPAN')).toBeGreaterThan(nodes.indexOf('IMG'))

    await vi.waitFor(() => expect(w.container.querySelector('.hn-skeleton')).toBeNull())
  })

  it('skeleton 为假时不渲染骨架', () => {
    const w = mount(<Image src="/a.webp" lazy={false} skeleton={false} />)
    expect(w.container.querySelector('.hn-skeleton')).toBeNull()
  })

  it('懒加载的图在骨架期间不绘制,骨架边缘不会透出图片', () => {
    const w = mount(<Image src="/a.webp" />)
    expect(w.container.querySelector('img')!.classList).toContain('opacity-0')
    expect(w.container.querySelector('.hn-skeleton')).not.toBeNull()
  })

  it('骨架形状交给外框裁,自己不带圆角', () => {
    const w = mount(<Image src="/a.webp" lazy={false} />)
    expect(w.container.querySelector('.hn-skeleton')!.classList).toContain('rounded-none')
    expect(w.element.classList).toContain('overflow-hidden')
  })

  it('skeleton 插槽替换内置占位', () => {
    const w = mount(<Image src="/a.webp" lazy={false} skeletonContent={<p>自定义占位</p>} />)
    expect(w.container.querySelector('.hn-skeleton')).toBeNull()
    expect(w.element.textContent).toBe('自定义占位')
  })
})

describe('渲染', () => {
  it('lazy 为假时立即带上地址', () => {
    const w = mount(<Image src="/a.webp" lazy={false} />)
    const img = w.container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('src')).toBe('/a.webp')
  })

  it('lazy 为真时 img 先占好位置,观察器放行之前不带地址', () => {
    const w = mount(<Image src="/a.webp" />)
    const img = w.container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('src')).toBeNull()
  })

  it('ratio 落在外框上,fit 落在图片上', () => {
    const w = mount(<Image src="/a.webp" lazy={false} ratio={16 / 9} fit="contain" />)
    expect(w.element.getAttribute('style')).toContain('aspect-ratio')
    expect(w.container.querySelector('img')!.classList).toContain('object-contain')
  })

  it('eager 给出高优先级并同步解码', () => {
    const w = mount(<Image src="/a.webp" lazy={false} eager />)
    const img = w.container.querySelector('img')!
    expect(img.getAttribute('fetchpriority')).toBe('high')
    expect(img.getAttribute('decoding')).toBe('sync')
  })

  it('默认异步解码', () => {
    const w = mount(<Image src="/a.webp" lazy={false} />)
    expect(w.container.querySelector('img')!.getAttribute('decoding')).toBe('async')
  })
})

describe('预览', () => {
  it('默认外框是 span,不带按钮语义', () => {
    const w = mount(<Image src="/a.webp" lazy={false} />)
    expect(w.element.tagName).toBe('SPAN')
    expect(w.element.classList).not.toContain('cursor-zoom-in')
  })

  it('设置 preview 后外框是按钮,带放大镜光标与焦点环', () => {
    const w = mount(<Image src="/a.webp" alt="海边" lazy={false} preview />)
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.element.getAttribute('type')).toBe('button')
    expect(w.element.classList).toContain('cursor-zoom-in')
    expect(w.element.classList).toContain('hn-focus-ring')
    expect(w.container.querySelector('img')).not.toBeNull()
  })

  it('preview 而 alt 为空时开发期告警', () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(<Image src="/a.webp" lazy={false} preview />)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]?.[0]).toContain('替代文本')
    warn.mockRestore()
  })

  it('有 alt 时不告警', () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(<Image src="/a.webp" alt="海边" lazy={false} preview />)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('样式归属', () => {
  it.each([
    { style: { width: '160px', height: '90px' } },
    { style: { width: '160px', height: '90px' } as CSSProperties },
    { style: { ...{ width: '160px' }, ...{ height: '90px' } } },
  ])('外框接收 style,图片接收 imageStyle: $style', ({ style }) => {
    const w = mount(
      <Image
        src="/a.webp"
        lazy={false}
        style={style}
        imageStyle={{ objectPosition: 'left top' }}
        sizes="160px"
      />,
    )
    const img = w.container.querySelector('img')!
    expect(w.element.style.width).toBe('160px')
    expect(w.element.style.height).toBe('90px')
    expect(w.element.style.objectPosition).toBe('')
    expect(img.style.width).toBe('')
    expect(img.style.objectPosition).toBe('left top')
    expect(img.getAttribute('sizes')).toBe('160px')
  })

  it('显式 style 可以覆盖 ratio,清除覆盖后恢复比例', () => {
    const props: ImageProps = { ratio: 1, style: { aspectRatio: '2' } }
    const w = mount(<Image {...props} />)
    expect(w.element.style.aspectRatio).toBe('2 / 1')
    w.rerender(<Image {...props} style={undefined} />)
    expect(w.element.style.aspectRatio).toBe('1 / 1')
  })
})
