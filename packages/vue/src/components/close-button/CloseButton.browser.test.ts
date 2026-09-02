import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import CloseButton from './CloseButton.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('close button · 关闭钮惯例', () => {
  it('默认取 locale 关闭词、ghost/neutral/sm;点击监听穿透到真按钮', async () => {
    const onClick = vi.fn()
    const w = mount(CloseButton, { attrs: { onClick }, attachTo: attach() })
    mounted.push(w)

    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('关闭')
    expect(btn.classes()).toContain('aspect-square')
    expect(btn.classes()).toContain('rounded-full')
    expect(btn.find('svg').exists()).toBe(true)

    await userEvent.click(btn.element as HTMLElement)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disabled 透传;label 可覆写;形状不开放恒为圆', () => {
    const w = mount(CloseButton, {
      props: { disabled: true, label: '收起面板' },
      attachTo: attach(),
    })
    mounted.push(w)
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('收起面板')
    expect(btn.classes()).toContain('rounded-full')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('xs 档 20px 圆、图标 12px，比 sm 低一档', () => {
    const xs = mount(CloseButton, { props: { size: 'xs' }, attachTo: attach() })
    const sm = mount(CloseButton, { attachTo: attach() })
    mounted.push(xs, sm)
    const btn = xs.find('button').element as HTMLElement
    expect(btn.offsetHeight).toBe(20)
    expect(btn.offsetWidth).toBe(20)
    expect((xs.find('svg').element as SVGElement).getBoundingClientRect().height).toBe(12)
    expect((sm.find('button').element as HTMLElement).offsetHeight).toBeGreaterThan(20)
  })
})
