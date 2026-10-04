import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import type { ComponentType, ReactNode } from 'react'
import { Popover } from '../components/popover/Popover'
import { Dialog } from '../components/dialog/Dialog'
import { AlertDialog } from '../components/alert-dialog/AlertDialog'
import { Button } from '../components/button/Button'
import { ConfigProvider } from './config'
import { mount } from '../../test/mount'
import { signal, tick } from '../../test/signal'
import '../../test/browser.css'

type Loose = ComponentType<Record<string, unknown>>

let wrapper: { unmount: () => Promise<void> } | undefined

beforeEach(async () => {
  await page.viewport(900, 700)
})

afterEach(async () => {
  await wrapper?.unmount()
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

async function harness({
  kind = 'alert',
  modal = true,
  location = 'before',
  reverse = false,
  teleportTo,
}: Partial<Options> = {}) {
  const parentOpen = signal(false)
  const childOpen = signal(false)
  const anchor = signal<HTMLElement | null>(null)
  const actions = signal(0)
  const trigger = (child: boolean) => (
    <button
      data-open={child ? 'child' : 'parent'}
      ref={
        child
          ? element => {
              if (anchor.value !== element) anchor.value = element
            }
          : undefined
      }
      style={
        child
          ? { width: '160px', height: '32px' }
          : {
              position: 'fixed',
              left: 'calc(50% - 80px)',
              top: 'calc(50% - 80px)',
              width: '160px',
              height: '32px',
            }
      }
      onClick={() => {
        ;(child ? childOpen : parentOpen).value = true
      }}
    >
      {child ? '打开子浮层' : '打开父浮层'}
    </button>
  )
  const body = (child: boolean) => (
    <div style={{ width: '280px', minHeight: '180px', display: 'grid', gap: '16px' }}>
      {child ? (
        <>
          <input
            aria-label="子输入"
            style={{ width: '200px', height: '32px', border: '1px solid' }}
          />
          <Button
            data-child-action=""
            onClick={() => {
              actions.value++
            }}
          >
            子操作
          </Button>
        </>
      ) : (
        <>
          <p>父浮层内容</p>
          {location === 'nested' ? <Overlay child /> : trigger(true)}
          <Button
            data-parent-action=""
            onClick={() => {
              actions.value++
            }}
          >
            父操作
          </Button>
        </>
      )}
    </div>
  )
  function Overlay({ child }: { child: boolean }) {
    const popover = reverse === child
    const state = child ? childOpen : parentOpen
    const open = state.use()
    const target = anchor.use()
    const Component = (popover ? Popover : kind === 'alert' ? AlertDialog : Dialog) as Loose
    const content: ReactNode = body(child)
    return (
      <Component
        title={child ? '子浮层' : '父浮层'}
        description="浮层顺序验证"
        className={child ? 'overlay-child' : 'overlay-parent'}
        placement="center"
        {...(popover ? { modal } : {})}
        {...(popover && child && location !== 'nested' ? { anchor: target } : {})}
        open={open}
        onOpenChange={(value: boolean) => {
          state.value = value
        }}
        {...(popover || kind === 'alert' ? { content } : { renderContent: () => content })}
      >
        {!child || location === 'nested' ? trigger(child) : undefined}
      </Component>
    )
  }
  const mounted = await mount(
    <ConfigProvider teleportTo={teleportTo}>
      <div>
        {location === 'before' ? (
          <>
            <Overlay child />
            <Overlay child={false} />
          </>
        ) : location === 'after' ? (
          <>
            <Overlay child={false} />
            <Overlay child />
          </>
        ) : (
          <Overlay child={false} />
        )}
      </div>
    </ConfigProvider>,
  )
  wrapper = mounted
  return { parentOpen, childOpen, actions, container: mounted.container }
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

async function openBoth(container: HTMLElement) {
  await userEvent.click(container.querySelector('[data-open="parent"]')!)
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
    const { parentOpen, childOpen, actions, container } = await harness(options)
    await openBoth(container)
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
  const { childOpen, container } = await harness()
  await openBoth(container)
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
  const { parentOpen, childOpen, actions, container } = await harness()
  await openBoth(container)
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
  const { parentOpen, container } = await harness({ reverse: true })
  await openBoth(container)
  parentOpen.value = false
  await vi.waitFor(() => expect(parentPanel()).toBeNull())
  await vi.waitFor(() => expect(childPanel()).toBeNull())
})

it.each([false, true])('完整保留退场动画，退场中重开不重建内容 reverse=%s', async reverse => {
  const { childOpen, container } = await harness({ reverse })
  await openBoth(container)
  const child = childPanel()!
  const input = child.querySelector('input')!
  input.value = '保留编辑内容'
  await Promise.all(child.getAnimations().map(animation => animation.finished))
  childOpen.value = false
  await tick()
  expect(childPanel()).toBe(child)
  expect(child.dataset.state).toBe('closed')
  expect(getComputedStyle(child).animationName).toBe(reverse ? 'hn-pop-out' : 'hn-modal-out')
  childOpen.value = true
  await tick()
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
  const { parentOpen, childOpen, container } = await harness({ teleportTo: target })
  expect(target.children.length).toBe(0)
  await openBoth(container)
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
  const { childOpen, container } = await harness()
  await openBoth(container)
  childOpen.value = false
  await vi.waitFor(() => expect(childPanel()).toBeNull())
  expect(document.querySelector('.hn-scrim')).toBeNull()
  await userEvent.click(parentPanel()!.querySelector('[data-open="child"]')!)
  await vi.waitFor(() => expect(childPanel()).not.toBeNull())
  expectChildAbove(parentPanel()!, childPanel()!)
})
