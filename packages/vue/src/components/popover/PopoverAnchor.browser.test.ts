import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, shallowRef } from 'vue'
import Popover from './Popover.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

function element(tag = 'button', left = 160, top = 120) {
  const el = document.createElement(tag)
  el.style.cssText = `position:fixed;left:${left}px;top:${top}px;width:80px;height:30px`
  el.textContent = tag
  document.body.appendChild(el)
  return el
}

function harness(extra: Record<string, unknown> = {}, withTrigger = false) {
  const anchor = shallowRef<HTMLElement | null>(element())
  const open = ref(false)
  const updates = vi.fn((value: boolean | undefined) => {
    open.value = !!value
  })
  anchor.value!.onclick = () => {
    open.value = !open.value
  }
  const wrapper = mount(
    {
      setup: () => () =>
        h(
          Popover,
          {
            anchor: anchor.value,
            open: open.value,
            'onUpdate:open': updates,
            'aria-label': '外部面板',
            align: 'start',
            ...extra,
          },
          {
            ...(withTrigger
              ? { default: () => h('button', { style: 'margin:40px' }, '内置触发器') }
              : {}),
            content: () =>
              h(
                'button',
                {
                  'data-inside': '',
                  onClick: () => {
                    open.value = false
                  },
                },
                '关闭',
              ),
          },
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  return { anchor, open, updates, wrapper }
}

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const position = () => panel()!.parentElement!.getBoundingClientRect()

describe('Popover 外部锚点', () => {
  it('无 Trigger 时按外部 DOM 定位，属性到达面板，替换锚点后持续更新', async () => {
    const { anchor, open, wrapper } = harness({
      'data-custom': 'yes',
      'aria-describedby': 'panel-description',
    })
    anchor.value!.focus()
    open.value = true
    await vi.waitFor(() => {
      expect(panel()?.getAttribute('aria-describedby')).toBe('panel-description')
      expect(position().left).toBeCloseTo(160, 0)
      expect(position().top).toBeCloseTo(158, 0)
    })
    expect(panel()!.getAttribute('aria-label')).toBe('外部面板')
    expect(panel()!.getAttribute('data-custom')).toBe('yes')
    expect(wrapper.findAll('button')).toHaveLength(0)
    expect(document.querySelectorAll('[aria-haspopup="dialog"]')).toHaveLength(0)

    anchor.value = element('button', 280, 220)
    await vi.waitFor(() => {
      expect(position().left).toBeCloseTo(280, 0)
      expect(position().top).toBeCloseTo(258, 0)
    })
  })

  it('默认插槽负责触发，显式 anchor 优先负责定位', async () => {
    const { wrapper } = harness({}, true)
    const trigger = wrapper.get('button').element as HTMLElement
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(position().left).toBeCloseTo(160, 0))
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it('open 先到、anchor 后到时等待定位，退场清空 anchor 不会跳位或提前卸载', async () => {
    const { anchor, open } = harness()
    const target = anchor.value
    anchor.value = null
    open.value = true
    await nextTick()
    expect(panel()).toBeNull()
    expect(open.value).toBe(true)

    anchor.value = target
    await vi.waitFor(() => expect(panel()?.getAttribute('data-state')).toBe('open'))
    const before = position()
    open.value = false
    anchor.value = null
    await nextTick()
    expect(panel()?.getAttribute('data-state')).toBe('closed')
    expect(getComputedStyle(panel()!).animationName).toBe('hn-pop-out')
    expect(position().left).toBeCloseTo(before.left, 0)
    expect(position().top).toBeCloseTo(before.top, 0)
    await vi.waitFor(() => expect(panel()).toBeNull())

    open.value = true
    await nextTick()
    expect(panel()).toBeNull()
  })

  it('空默认插槽且无 anchor 时不显示无定位的面板', async () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: { default: () => [], content: () => h('button', '内容') },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await nextTick()
    expect(panel()).toBeNull()
  })

  it('非模态允许外部点击，重复点击外部按钮能关闭而不会重新打开', async () => {
    const { anchor, open } = harness({ modal: false })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    expect(document.body.style.pointerEvents).not.toBe('none')
    expect(document.body.style.overflow).not.toBe('hidden')
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(open.value).toBe(false)
  })

  it.each([true, false])('modal=%s 的 Esc 关闭同步 open 且恢复打开前的焦点', async modal => {
    const close = vi.fn()
    const { anchor, open, updates } = harness({ modal, onCloseAutoFocus: close })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()?.contains(document.activeElement)).toBe(true))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(open.value).toBe(false)
    expect(updates).toHaveBeenCalledWith(false)
    expect(document.activeElement).toBe(anchor.value)
    expect(close).toHaveBeenCalledOnce()
  })

  it('非模态外部点击保持外部焦点，事件只转发一次', async () => {
    const pointer = vi.fn()
    const outside = vi.fn()
    const { anchor, open } = harness({
      modal: false,
      onPointerDownOutside: pointer,
      onInteractOutside: outside,
    })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    const other = element('button', 300, 80)
    other.textContent = '外部按钮'
    await userEvent.click(other)
    expect(document.activeElement).toBe(other)
    expect(pointer).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(open.value).toBe(false)
    expect(document.activeElement).toBe(other)
    expect(pointer).toHaveBeenCalledOnce()
    expect(
      outside.mock.calls.filter(([event]) => event.detail.originalEvent.type === 'pointerdown'),
    ).toHaveLength(1)
  })

  it('可取消 Esc 与外部交互，不影响后续正常关闭', async () => {
    let cancel = true
    const escape = vi.fn((event: KeyboardEvent) => {
      if (cancel) event.preventDefault()
    })
    const outside = vi.fn((event: Event) => {
      if (cancel) event.preventDefault()
    })
    const { anchor, open } = harness({
      modal: false,
      onEscapeKeyDown: escape,
      onInteractOutside: outside,
    })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    expect(escape).toHaveBeenCalledOnce()
    expect(open.value).toBe(true)
    await userEvent.click(element('button', 300, 80))
    expect(outside).toHaveBeenCalled()
    expect(open.value).toBe(true)
    cancel = false
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('隐藏锚点不会获得焦点，取消打开聚焦后可继续编辑', async () => {
    const editor = element('textarea', 40, 360)
    editor.focus()
    const opening = vi.fn((event: Event) => event.preventDefault())
    const { anchor, open } = harness({ modal: false, onOpenAutoFocus: opening })
    const hidden = element('span')
    hidden.style.visibility = 'hidden'
    anchor.value = hidden
    open.value = true
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    expect(opening).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(editor)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(editor)
  })

  it.each([true, false])('modal=%s 取消关闭聚焦后，内置 Trigger 也不会抢走焦点', async modal => {
    const editor = element('textarea', 40, 360)
    const closing = vi.fn((event: Event) => {
      event.preventDefault()
      editor.focus()
    })
    const { wrapper } = harness({ modal, onCloseAutoFocus: closing }, true)
    await userEvent.click(wrapper.get('button').element as HTMLElement)
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(closing).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(editor)
  })

  it('关闭退场期间调用方已聚焦编辑器时不再恢复旧焦点', async () => {
    const { anchor, open } = harness({ modal: false })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    open.value = false
    await nextTick()
    const editor = element('textarea', 40, 360)
    editor.focus()
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(editor)
  })
  it('嵌套浮层的内容交互与 Esc 只关闭最上层', async () => {
    const anchor = element()
    const open = ref(true)
    const innerOpen = ref(false)
    const innerAnchor = shallowRef<HTMLElement | null>(null)
    const wrapper = mount(
      {
        setup: () => () =>
          h(
            Popover,
            {
              anchor,
              open: open.value,
              modal: false,
              'aria-label': '外层',
              'onUpdate:open': (value: boolean | undefined) => {
                open.value = !!value
              },
            },
            {
              content: () => [
                h(
                  'button',
                  {
                    onClick: (event: MouseEvent) => {
                      innerAnchor.value = event.currentTarget as HTMLElement
                      innerOpen.value = true
                    },
                  },
                  '打开内层',
                ),
                h(
                  Popover,
                  {
                    anchor: innerAnchor.value,
                    open: innerOpen.value,
                    modal: false,
                    'aria-label': '内层',
                    'onUpdate:open': (value: boolean | undefined) => {
                      innerOpen.value = !!value
                    },
                  },
                  { content: () => h('button', { 'data-inner': '' }, '内层按钮') },
                ),
              ],
            },
          ),
      },
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    await userEvent.click(document.querySelector('[role="dialog"] button') as HTMLElement)
    await vi.waitFor(() => expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2))
    expect(open.value).toBe(true)
    await vi.waitFor(() => {
      const box = document.querySelector('[data-inner]')!.getBoundingClientRect()
      expect(box.top).toBeGreaterThanOrEqual(0)
      expect(box.left).toBeGreaterThanOrEqual(0)
    })
    await userEvent.click(document.querySelector('[data-inner]') as HTMLElement)
    expect(open.value).toBe(true)
    expect(innerOpen.value).toBe(true)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1))
    expect(open.value).toBe(true)
    expect(innerOpen.value).toBe(false)
  })

  it('退场中重新打开并切换锚点，不清空新定位或恢复旧焦点', async () => {
    const { anchor, open } = harness({ modal: false })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(panel()?.contains(document.activeElement)).toBe(true))
    open.value = false
    anchor.value = null
    await nextTick()
    anchor.value = element('button', 280, 220)
    open.value = true
    await vi.waitFor(() => {
      expect(panel()?.getAttribute('data-state')).toBe('open')
      expect(position().left).toBeCloseTo(280, 0)
    })
    await new Promise(resolve => setTimeout(resolve, 250))
    expect(panel()?.contains(document.activeElement)).toBe(true)
    expect(open.value).toBe(true)
  })
})
