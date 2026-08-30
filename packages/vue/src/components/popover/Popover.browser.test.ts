import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
import Popover from './Popover.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(popoverProps: Record<string, unknown> = {}, open?: Ref<boolean>) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () => {
        const bound: Record<string, unknown> = { ...popoverProps }
        if (open) {
          bound.open = open.value
          bound['onUpdate:open'] = (v: boolean) => (open.value = v)
        }
        return h(
          'div',
          { style: 'padding: 160px' },
          h(Popover, bound, {
            default: () => h(Button, { variant: 'outline', tone: 'neutral' }, () => '打开'),
            content: () => h('p', '面板内容'),
          }),
        )
      },
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const panel = () => document.querySelector('[data-side]') as HTMLElement | null

describe('popover · 驻留型小浮层', () => {
  it('闭合不进 DOM;点击打开进 Portal:surface 面 + 发丝线 + 大阴影 + z token,base 档 pop', async () => {
    const w = harness()
    expect(panel()).toBeNull()

    const btn = w.find('button').element as HTMLElement
    await userEvent.click(btn)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const content = panel()!
    expect(content.textContent).toContain('面板内容')
    expect(w.element.contains(content)).toBe(false)
    expect(content.dataset.side).toBe('bottom')

    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--hn-surface)'
    document.body.appendChild(probe)
    const style = getComputedStyle(content)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).backgroundColor)
    expect(Number.parseFloat(style.borderTopWidth)).toBeGreaterThan(0)
    expect(style.boxShadow).not.toBe('none')
    expect(style.zIndex).toBe('100')
    expect(style.borderRadius).toBe('8px')
    expect(content.className).toContain('hn-anim-pop')
    expect(style.animationDuration).toBe('0.3s')

    expect(content.querySelector('svg')).toBeNull()
  })

  it('驻留即锁滚:开着时 body 冻结,关掉还原;触发器持续按下墨', async () => {
    const w = harness()
    const btn = w.find('button').element as HTMLElement
    await userEvent.click(btn)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(document.body.style.pointerEvents).toBe('none')
    expect(document.body.style.overflow).toBe('hidden')
    await vi.waitFor(() => expect(getComputedStyle(btn, '::after').opacity).toBe('0.1'))

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')

    const park = document.createElement('div')
    park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
    document.body.appendChild(park)
    await userEvent.hover(park)
    await vi.waitFor(() => expect(getComputedStyle(btn, '::after').opacity).toBe('0'))
  })

  it('Esc 与点外都能关;触发器 aria-expanded 联动', async () => {
    const w = harness()
    const btn = w.find('button').element as HTMLElement
    expect(btn.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(btn)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(btn.getAttribute('aria-expanded')).toBe('true')

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(btn.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(btn)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.click(document.body, { force: true })
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('v-model:open 受控,外部置 false 收回', async () => {
    const open = ref(false)
    const w = harness({}, open)
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(open.value).toBe(true))

    open.value = false
    await w.vm.$forceUpdate()
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('side 可换', async () => {
    const w = harness({ side: 'right' })
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(panel()!.dataset.side).toBe('right')
  })
})
