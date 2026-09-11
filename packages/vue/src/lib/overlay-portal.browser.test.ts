import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, shallowRef, type Component } from 'vue'
import { ConfigProvider } from 'reka-ui'
import Popover from '../components/popover/Popover.vue'
import Dialog from '../components/dialog/Dialog.vue'
import AlertDialog from '../components/alert-dialog/AlertDialog.vue'
import Button from '../components/button/Button.vue'
import '../../test/browser.css'

let wrapper: VueWrapper | undefined

beforeEach(async () => {
  await page.viewport(900, 700)
})

afterEach(async () => {
  wrapper?.unmount()
  await vi.waitFor(() => {
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })
  document.body.innerHTML = ''
})

type Options = {
  kind: 'alert' | 'dialog'
  modal: boolean
  location: 'nested' | 'before' | 'after'
  reverse: boolean
  teleportTo?: HTMLElement
}

const parentPanel = () => document.querySelector<HTMLElement>('.overlay-parent')
const childPanel = () => document.querySelector<HTMLElement>('.overlay-child')

function harness({
  kind = 'alert',
  modal = true,
  location = 'before',
  reverse = false,
  teleportTo,
}: Partial<Options> = {}) {
  const parentOpen = ref(false)
  const childOpen = ref(false)
  const anchor = shallowRef<HTMLElement | null>(null)
  const actions = ref(0)
  const trigger = (child: boolean) =>
    h(
      'button',
      {
        'data-open': child ? 'child' : 'parent',
        ref: child ? anchor : undefined,
        style: child
          ? 'width:160px;height:32px'
          : 'position:fixed;left:calc(50% - 80px);top:calc(50% - 80px);width:160px;height:32px',
        onClick: () => {
          ;(child ? childOpen : parentOpen).value = true
        },
      },
      child ? '打开子浮层' : '打开父浮层',
    )
  const body = (child: boolean) =>
    h(
      'div',
      {
        style: 'width:280px;min-height:180px;display:grid;gap:16px',
      },
      child
        ? [
            h('input', {
              'aria-label': '子输入',
              style: 'width:200px;height:32px;border:1px solid',
            }),
            h(
              Button,
              {
                'data-child-action': '',
                onClick: () => {
                  actions.value++
                },
              },
              () => '子操作',
            ),
          ]
        : [
            h('p', '父浮层内容'),
            location === 'nested' ? overlay(true) : trigger(true),
            h(
              Button,
              {
                'data-parent-action': '',
                onClick: () => {
                  actions.value++
                },
              },
              () => '父操作',
            ),
          ],
    )
  const overlay = (child: boolean) => {
    const popover = reverse === child
    const state = child ? childOpen : parentOpen
    const Overlay: Component = popover ? Popover : kind === 'alert' ? AlertDialog : Dialog
    return h(
      Overlay,
      {
        title: child ? '子浮层' : '父浮层',
        description: '浮层顺序验证',
        class: child ? 'overlay-child' : 'overlay-parent',
        placement: 'center',
        ...(popover ? { modal } : {}),
        ...(popover && child && location !== 'nested' ? { anchor: anchor.value } : {}),
        open: state.value,
        'onUpdate:open': (value: boolean) => {
          state.value = value
        },
      },
      {
        ...(!child || location === 'nested' ? { default: () => trigger(child) } : {}),
        content: () => body(child),
      },
    )
  }
  wrapper = mount(
    {
      setup: () => () =>
        h(
          ConfigProvider,
          { teleportTo },
          {
            default: () =>
              h(
                'div',
                location === 'before'
                  ? [overlay(true), overlay(false)]
                  : location === 'after'
                    ? [overlay(false), overlay(true)]
                    : [overlay(false)],
              ),
          },
        ),
    },
    { attachTo: document.body },
  )
  return { parentOpen, childOpen, actions }
}

function hitWithParentEnabled(parent: HTMLElement, x: number, y: number) {
  const previous = parent.style.pointerEvents
  try {
    parent.style.pointerEvents = 'auto'
    return document.elementFromPoint(x, y)
  } finally {
    parent.style.pointerEvents = previous
  }
}

function expectChildAbove(parent: HTMLElement, child: HTMLElement) {
  const a = parent.getBoundingClientRect()
  const b = child.getBoundingClientRect()
  const left = Math.max(a.left, b.left)
  const right = Math.min(a.right, b.right)
  const top = Math.max(a.top, b.top)
  const bottom = Math.min(a.bottom, b.bottom)
  expect(right).toBeGreaterThan(left)
  expect(bottom).toBeGreaterThan(top)
  expect(child.contains(hitWithParentEnabled(parent, (left + right) / 2, (top + bottom) / 2))).toBe(
    true,
  )
}

async function openBoth() {
  await userEvent.click(wrapper!.get('[data-open="parent"]').element)
  await vi.waitFor(() => expect(parentPanel()).not.toBeNull())
  await userEvent.click(parentPanel()!.querySelector('[data-open="child"]')!)
  await vi.waitFor(() => expect(childPanel()).not.toBeNull())
  await vi.waitFor(() => expectChildAbove(parentPanel()!, childPanel()!))
}

const cases = (['alert', 'dialog'] as const).flatMap(kind =>
  [true, false].flatMap(modal =>
    (['nested', 'before', 'after'] as const).flatMap(location =>
      [false, true].map(reverse => ({ kind, modal, location, reverse })),
    ),
  ),
)

it.each(cases)(
  '$kind modal=$modal location=$location reverse=$reverse: 视觉顺序、焦点和关闭顺序一致',
  async options => {
    const { parentOpen, childOpen, actions } = harness(options)
    await openBoth()
    const parent = parentPanel()!
    const child = childPanel()!
    expect(child.closest('[aria-hidden="true"]')).toBeNull()
    expect(parentOpen.value).toBe(true)
    expect(childOpen.value).toBe(true)
    if (!options.reverse || options.modal) {
      expect(getComputedStyle(parent).pointerEvents).toBe('none')
      expect(parent.closest('[aria-hidden="true"]')).not.toBeNull()
    }
    await userEvent.click(child.querySelector('[data-child-action]')!)
    const input = child.querySelector('input')!
    await userEvent.click(input)
    await userEvent.keyboard('x')
    expect(input.value).toBe('x')
    expect(actions.value).toBe(1)
    if (!options.reverse || options.modal) {
      for (let i = 0; i < 4; i++) await userEvent.tab()
      expect(child.contains(document.activeElement)).toBe(true)
    }
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(childPanel()).toBeNull())
    expect(parentPanel()).toBe(parent)
    expect(parentOpen.value).toBe(true)
    expect(childOpen.value).toBe(false)
    await vi.waitFor(() => {
      expect(parent.closest('[aria-hidden="true"]')).toBeNull()
      expect(getComputedStyle(parent).pointerEvents).toBe('auto')
      expect(document.activeElement).toBe(parent.querySelector('[data-open="child"]'))
    })
    await userEvent.click(parent.querySelector('[data-parent-action]')!)
    expect(actions.value).toBe(2)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(parentPanel()).toBeNull())
    expect(document.querySelector('.hn-scrim')).toBeNull()
  },
)

it('Popover 位于新弹窗的遮罩之下，重复打开仍按打开顺序叠放', async () => {
  const { childOpen } = harness()
  await openBoth()
  for (let cycle = 0; cycle < 2; cycle++) {
    const parent = parentPanel()!
    const child = childPanel()!
    const a = parent.getBoundingClientRect()
    const b = child.getBoundingClientRect()
    const x = Math.min(a.right, b.right) - 8
    const y = Math.min(a.bottom, b.bottom) - 8
    const scrim = document.querySelector<HTMLElement>('.hn-scrim')!
    const visibility = child.parentElement!.style.visibility
    try {
      child.parentElement!.style.visibility = 'hidden'
      expect(hitWithParentEnabled(parent, x, y)).toBe(scrim)
    } finally {
      child.parentElement!.style.visibility = visibility
    }
    childOpen.value = false
    await vi.waitFor(() => expect(childPanel()).toBeNull())
    expect(document.querySelector('.hn-scrim')).toBeNull()
    await userEvent.click(parent.querySelector('[data-open="child"]')!)
    await vi.waitFor(() => expect(childPanel()).not.toBeNull())
    await vi.waitFor(() => expectChildAbove(parent, childPanel()!))
    expect(childPanel()!.closest('[aria-hidden="true"]')).toBeNull()
  }
})

it('父 Popover 先关闭时独立弹窗继续保持交互', async () => {
  const { parentOpen, childOpen, actions } = harness()
  await openBoth()
  parentOpen.value = false
  await vi.waitFor(() => expect(parentPanel()).toBeNull())
  expect(childOpen.value).toBe(true)
  const child = childPanel()!
  expect(child.closest('[aria-hidden="true"]')).toBeNull()
  expect(document.body.style.overflow).toBe('hidden')
  await userEvent.click(child.querySelector('[data-child-action]')!)
  expect(actions.value).toBe(1)
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(childPanel()).toBeNull())
})

it('父弹窗卸载锚点后，外部 Popover 正常退场并解除页面锁定', async () => {
  const { parentOpen } = harness({ reverse: true })
  await openBoth()
  parentOpen.value = false
  await vi.waitFor(() => expect(parentPanel()).toBeNull())
  await vi.waitFor(() => expect(childPanel()).toBeNull())
})

it.each([false, true])('完整保留退场动画，退场中重开不重建内容 reverse=%s', async reverse => {
  const { childOpen } = harness({ reverse })
  await openBoth()
  const child = childPanel()!
  const input = child.querySelector('input')!
  input.value = '保留编辑内容'
  await Promise.all(child.getAnimations().map(animation => animation.finished))
  childOpen.value = false
  await nextTick()
  expect(childPanel()).toBe(child)
  expect(child.dataset.state).toBe('closed')
  expect(getComputedStyle(child).animationName).toBe(reverse ? 'hn-pop-out' : 'hn-modal-out')
  childOpen.value = true
  await nextTick()
  expect(childPanel()).toBe(child)
  expect(child.dataset.state).toBe('open')
  expect(child.querySelector('input')!.value).toBe('保留编辑内容')
  await Promise.all(child.getAnimations().map(animation => animation.finished))
  const onAnimationEnd = vi.fn()
  child.addEventListener('animationend', onAnimationEnd)
  childOpen.value = false
  await vi.waitFor(() => expect(childPanel()).toBeNull())
  expect(onAnimationEnd).toHaveBeenCalled()
})

it('尊重 ConfigProvider 的 Portal 容器并清理关闭的弹窗包装', async () => {
  const target = document.createElement('div')
  document.body.appendChild(target)
  const { parentOpen, childOpen } = harness({ teleportTo: target })
  expect(target.children.length).toBe(0)
  await openBoth()
  expect(target.contains(parentPanel())).toBe(true)
  expect(target.contains(childPanel())).toBe(true)
  expect(childPanel()!.closest('[aria-hidden="true"]')).toBeNull()
  childOpen.value = false
  await vi.waitFor(() => expect(childPanel()).toBeNull())
  parentOpen.value = false
  await vi.waitFor(() => expect(parentPanel()).toBeNull())
  expect(target.children.length).toBe(0)
})

it('关闭动画被禁用时也会清理 Portal，并允许再次打开', async () => {
  const style = document.createElement('style')
  style.textContent = '.overlay-parent, .overlay-child, .hn-scrim { animation: none !important; }'
  document.body.appendChild(style)
  const { childOpen } = harness()
  await openBoth()
  childOpen.value = false
  await vi.waitFor(() => expect(childPanel()).toBeNull())
  expect(document.querySelector('.hn-scrim')).toBeNull()
  await userEvent.click(parentPanel()!.querySelector('[data-open="child"]')!)
  await vi.waitFor(() => expect(childPanel()).not.toBeNull())
  expectChildAbove(parentPanel()!, childPanel()!)
})
