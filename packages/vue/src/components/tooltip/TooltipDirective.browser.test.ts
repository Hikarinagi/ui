import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, Teleport, withDirectives } from 'vue'
import { vTooltip } from './directive'
import type { TooltipDirectiveValue } from './types'
import TooltipProvider from './TooltipProvider.vue'
import Tooltip from './Tooltip.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;bottom:0;right:0;width:8px;height:8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
})

const tip = () => document.querySelector('[role="tooltip"]') as HTMLElement | null
const bubble = () => document.querySelector('[data-side]') as HTMLElement | null

function harness(initial: TooltipDirectiveValue = '说明', delayDuration = 0) {
  const value = ref(initial)
  const visible = ref(true)
  const description = ref('existing')
  const click = vi.fn()
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(TooltipProvider, { delayDuration }, () =>
          h('div', { style: 'padding:120px;display:flex;gap:32px' }, [
            h('span', { id: 'existing' }, '已有说明'),
            visible.value
              ? withDirectives(
                  h(
                    'button',
                    {
                      id: 'trigger',
                      type: 'button',
                      'aria-describedby': description.value,
                      'data-state': 'selected',
                      onClick: click,
                    },
                    '按钮',
                  ),
                  [[vTooltip, value.value]],
                )
              : null,
            h(Tooltip, { content: '组件提示' }, () => h('button', { id: 'component' }, '组件')),
          ]),
        ),
    }),
    { attachTo: document.body },
  )
  mounted.push(w)
  return {
    w,
    value,
    visible,
    description,
    click,
    target: w.find('#trigger').element as HTMLElement,
  }
}

describe('tooltip directive', () => {
  it('uses the existing element, shared appearance and anchor geometry without changing host state', async () => {
    const { w, target } = harness()
    const parent = target.parentElement
    const count = parent?.childElementCount
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('说明'))
    expect(target.parentElement).toBe(parent)
    expect(parent?.childElementCount).toBe(count)
    expect(target.getAttribute('data-state')).toBe('selected')
    expect(target.getAttribute('aria-describedby')).toBe('existing ' + tip()!.id)
    expect(w.element.contains(bubble())).toBe(false)
    expect(getComputedStyle(bubble()!).zIndex).toBe('100')
    expect(bubble()?.className).toContain('hn-anim-pop')
    await vi.waitFor(() =>
      expect(bubble()!.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        target.getBoundingClientRect().top,
      ),
    )
    await userEvent.hover(bubble()!)
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(tip()?.textContent).toBe('说明')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(bubble()).toBeNull())
    expect(target.getAttribute('aria-describedby')).toBe('existing')
  })

  it.each(['directive', 'component'])(
    'closes the %s tooltip when the pointer leaves for plain content',
    async kind => {
      const { w, target } = harness()
      const trigger = kind === 'directive' ? target : w.find('#component').element
      await userEvent.hover(trigger)
      await vi.waitFor(() => expect(tip()).toBeTruthy())
      const outside = w.find('#existing').element
      await userEvent.hover(outside)
      await userEvent.hover(outside, { position: { x: 1, y: 1 } })
      await vi.waitFor(() => expect(bubble()).toBeNull())
      if (kind === 'directive') expect(target.getAttribute('aria-describedby')).toBe('existing')
    },
  )

  it('closes after leaving the hoverable content and still works after re-enabling', async () => {
    const { w, target, value } = harness()
    for (const disabled of [false, true]) {
      if (disabled) {
        value.value = { content: '说明', disabled: true }
        await nextTick()
        await vi.waitFor(() => expect(bubble()).toBeNull())
        value.value = '说明'
      }
      await userEvent.hover(target)
      await vi.waitFor(() => expect(bubble()).toBeTruthy())
      await userEvent.hover(bubble()!)
      expect(tip()?.textContent).toBe('说明')
      const outside = w.find('#existing').element
      await userEvent.hover(outside)
      await userEvent.hover(outside, { position: { x: 1, y: 1 } })
      await vi.waitFor(() => expect(bubble()).toBeNull())
    }
  })

  it('updates options and descriptions while open, and closes when disabled or empty', async () => {
    const { target, value, description } = harness({ content: '最初', side: 'top' })
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()).toBeTruthy())
    const id = tip()!.id
    value.value = { content: '<b>文字</b>', side: 'bottom', sideOffset: 16 }
    description.value = 'replacement'
    await vi.waitFor(() => expect(tip()?.textContent).toBe('<b>文字</b>'))
    expect(bubble()!.querySelector('b')).toBeNull()
    expect(bubble()?.dataset.side).toBe('bottom')
    expect(target.getAttribute('aria-describedby')).toBe('replacement ' + id)
    value.value = { content: '禁用', disabled: true }
    await vi.waitFor(() => expect(bubble()).toBeNull())
    expect(target.getAttribute('aria-describedby')).toBe('replacement')
    await userEvent.unhover(target)
    value.value = { content: '重新启用' }
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('重新启用'))
    value.value = ''
    await vi.waitFor(() => expect(bubble()).toBeNull())
  })

  it('preserves click handlers and only opens on keyboard focus', async () => {
    const { target, click } = harness()
    await userEvent.click(target)
    expect(click).toHaveBeenCalledOnce()
    await userEvent.unhover(target)
    target.blur()
    target.focus()
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(tip()).toBeNull()
    target.blur()
    await userEvent.keyboard('{ArrowDown}')
    target.focus()
    await vi.waitFor(() => expect(tip()).toBeTruthy())
    target.blur()
    await vi.waitFor(() => expect(bubble()).toBeNull())
  })

  it('shares provider delay and skip-delay with component tooltips', async () => {
    const { w, target } = harness('延迟', 400)
    await userEvent.hover(target)
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(tip()).toBeNull()
    await vi.waitFor(() => expect(tip()?.textContent).toBe('延迟'))
    const directiveId = tip()!.id
    const outside = w.find('#existing').element
    await userEvent.hover(outside)
    await userEvent.hover(outside, { position: { x: 1, y: 1 } })
    await userEvent.hover(w.find('#component').element)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('组件提示'), { timeout: 250 })
    expect(tip()!.id).not.toBe(directiveId)
    await vi.waitFor(() => expect(target.getAttribute('aria-describedby')).toBe('existing'))
  })

  it('removes a pending or open tooltip and its listeners when the host unmounts', async () => {
    const { target, visible } = harness('等待', 200)
    await userEvent.hover(target)
    visible.value = false
    await vi.waitFor(() => expect(target.isConnected).toBe(false))
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(tip()).toBeNull()
    target.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse' }))
    await new Promise(resolve => setTimeout(resolve, 250))
    expect(tip()).toBeNull()
    expect(target.getAttribute('aria-describedby')).toBe('existing')
    expect(target.hasAttribute('data-grace-area-trigger')).toBe(false)

    const next = harness()
    await userEvent.hover(next.target)
    await vi.waitFor(() => expect(tip()).toBeTruthy())
    next.visible.value = false
    await vi.waitFor(() => expect(tip()).toBeNull())
    expect(next.target.getAttribute('aria-describedby')).toBe('existing')
  })

  it('inherits the nearest provider through slots and portals, including directives on components', async () => {
    const value = ref('传送提示')
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(TooltipProvider, { delayDuration: 10000 }, () =>
            h(TooltipProvider, { delayDuration: 0 }, () =>
              h(Teleport, { to: 'body' }, [
                withDirectives(
                  h(Button, { id: 'portal-target', style: 'margin:120px' }, () => '传送'),
                  [[vTooltip, value.value]],
                ),
              ]),
            ),
          ),
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    const target = document.querySelector('#portal-target') as HTMLElement
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('传送提示'), { timeout: 300 })
    value.value = '更新'
    await vi.waitFor(() => expect(tip()?.textContent).toBe('更新'))
  })

  it('uses distinct ids across directive roots', async () => {
    const first = harness('第一')
    const second = harness('第二')
    await userEvent.hover(first.target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('第一'))
    const id = tip()!.id
    await userEvent.hover(second.target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('第二'))
    expect(tip()!.id).not.toBe(id)
    expect(document.querySelectorAll('[id="' + id + '"]')).toHaveLength(0)
  })

  it('does not mount a tooltip without a provider', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          withDirectives(h('button', { style: 'margin:120px' }, '独立'), [[vTooltip, '提示']]),
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    await userEvent.hover(w.element)
    expect(tip()).toBeNull()
  })
})
