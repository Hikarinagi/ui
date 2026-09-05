import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
import HoverCard from './HoverCard.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(props: Record<string, unknown> = {}, open?: Ref<boolean>) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () => {
        const bound: Record<string, unknown> = { ...props }
        if (open) {
          bound.open = open.value
          bound['onUpdate:open'] = (value: boolean) => (open.value = value)
        }
        return h(
          'div',
          { style: 'padding: 160px' },
          h(HoverCard, bound, {
            default: () => h('a', { href: '#' }, '@shion'),
            content: () => h('p', '星见书音的资料'),
          }),
        )
      },
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const panel = () => document.querySelector('[data-hn-hover-card]') as HTMLElement | null

function settle(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('HoverCard', () => {
  it('悬停一段时间后浮出预览卡：Card 面、pop 动效、无箭头、不锁滚', async () => {
    const w = harness({ openDelay: 100, closeDelay: 50 })
    const trigger = w.find('a').element as HTMLElement
    expect(panel()).toBeNull()

    await userEvent.hover(trigger)
    expect(panel()).toBeNull()
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const content = panel()!
    expect(content.textContent).toContain('星见书音的资料')
    expect(w.element.contains(content)).toBe(false)
    expect(content.dataset.side).toBe('bottom')
    expect(content.className).toContain('hn-anim-pop')
    expect(content.querySelector('svg')).toBeNull()
    const probe = document.createElement('span')
    probe.style.backgroundColor = 'var(--hn-surface)'
    document.body.appendChild(probe)
    const style = getComputedStyle(content)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).backgroundColor)
    expect(style.boxShadow).not.toBe('none')
    expect(document.body.style.overflow).toBe('')
    expect(document.body.style.pointerEvents).toBe('')
  })

  it('指针移开后延时收回；移进卡片则保持打开', async () => {
    const w = harness({ openDelay: 100, closeDelay: 150 })
    const trigger = w.find('a').element as HTMLElement
    await userEvent.hover(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    await userEvent.hover(panel()!)
    await settle(300)
    expect(panel()).toBeTruthy()

    await userEvent.unhover(panel()!)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('键盘聚焦触发器立即打开，焦点离开即收回', async () => {
    const w = harness({ openDelay: 100, closeDelay: 50 })
    expect(w.find('a').exists()).toBe(true)
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('side 决定方向，open 支持受控', async () => {
    const open = ref(false)
    harness({ side: 'top' }, open)
    open.value = true
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(panel()!.dataset.side).toBe('top')
    open.value = false
    await vi.waitFor(() => expect(panel()).toBeNull())
  })
})
