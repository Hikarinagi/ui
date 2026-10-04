import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import type { ComponentType, ReactNode } from 'react'
import { Sheet } from '../components/sheet/Sheet'
import { Drawer } from '../components/drawer/Drawer'
import { Dialog } from '../components/dialog/Dialog'
import { AlertDialog } from '../components/alert-dialog/AlertDialog'
import { DropdownMenu } from '../components/dropdown-menu/DropdownMenu'
import { Popover } from '../components/popover/Popover'
import { ConfigProvider } from './config'
import { mount } from '../../test/mount'
import { signal, tick } from '../../test/signal'
import '../../test/browser.css'

interface OverlayProps {
  title: string
  description?: string
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  content?: ReactNode
  renderContent?: () => ReactNode
  label?: string
  anchor?: HTMLElement | null
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}

let wrapper: { unmount: () => Promise<void>; container: HTMLElement } | undefined
beforeEach(async () => {
  await page.viewport(1000, 800)
  document.body.innerHTML = ''
})
afterEach(async () => {
  await wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => {
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })
  document.body.innerHTML = ''
})

const components: Record<string, ComponentType<OverlayProps>> = {
  Sheet,
  Drawer,
  DropdownMenu: DropdownMenu as ComponentType<OverlayProps>,
  Dialog,
  AlertDialog,
  Popover: Popover as ComponentType<OverlayProps>,
}
const panel = (name: string) => document.querySelector<HTMLElement>('.order-' + name)

async function render(
  kind: string,
  order: 'before' | 'after' = 'before',
  teleportTo?: HTMLElement,
) {
  const aOpen = signal(false)
  const bOpen = signal(false)
  const clicks = signal(0)
  const anchor = signal<HTMLElement | null>(null)
  const setAnchor = (element: HTMLElement | null) => {
    if (anchor.value !== element) anchor.value = element
  }
  const anchored = kind === 'DropdownMenu' || kind === 'Popover'
  const Overlay = components[kind]!
  const body = (name: 'a' | 'b') => (
    <div style={{ width: '280px', height: '200px', display: 'grid', gap: '12px' }}>
      {name === 'b' ? (
        <button
          ref={setAnchor}
          data-open-a=""
          onClick={() => {
            aOpen.value = true
          }}
          style={{ height: '32px', width: '160px' }}
        >
          Open A
        </button>
      ) : (
        <input aria-label="A input" style={{ height: '32px', width: '160px' }} />
      )}
      <button
        data-action={name}
        onClick={() => {
          clicks.value++
        }}
        style={{ height: '32px', width: '160px' }}
      >
        {'Action ' + name}
      </button>
    </div>
  )
  function Panel({ name }: { name: 'a' | 'b' }) {
    const state = name === 'a' ? aOpen : bOpen
    const currentAnchor = anchor.use()
    const content =
      kind === 'AlertDialog' || anchored
        ? { content: body(name) }
        : { renderContent: () => body(name) }
    const placement = anchored
      ? {
          label: name.toUpperCase(),
          anchor: name === 'a' ? currentAnchor : undefined,
          sideOffset: -16,
          align: 'start' as const,
        }
      : {}
    return (
      <Overlay
        title={name.toUpperCase()}
        description="Overlay order"
        className={'order-' + name}
        open={state.use()}
        onOpenChange={value => {
          state.value = value
        }}
        {...content}
        {...placement}
      >
        {name === 'b' ? (
          <button
            data-open-b=""
            style={{
              position: 'fixed',
              left: '280px',
              top: '160px',
              width: '160px',
              height: '32px',
            }}
          >
            Open B
          </button>
        ) : undefined}
      </Overlay>
    )
  }
  function DeepB() {
    return (
      <div>
        <div>
          <Panel name="b" />
        </div>
      </div>
    )
  }
  wrapper = await mount(
    <ConfigProvider teleportTo={teleportTo}>
      <div>
        {order === 'before' ? (
          <>
            <Panel name="a" />
            <DeepB />
          </>
        ) : (
          <>
            <DeepB />
            <Panel name="a" />
          </>
        )}
      </div>
    </ConfigProvider>,
  )
  return { aOpen, bOpen, clicks }
}

async function entered(name: string) {
  await vi.waitFor(() => expect(panel(name)?.dataset.state).toBe('open'))
  await Promise.allSettled(
    panel(name)!
      .getAnimations()
      .map(animation => animation.finished),
  )
}

function expectAbove() {
  const a = panel('a')!,
    b = panel('b')!
  const x = a.getBoundingClientRect(),
    y = b.getBoundingClientRect()
  const left = Math.max(x.left, y.left),
    right = Math.min(x.right, y.right)
  const top = Math.max(x.top, y.top),
    bottom = Math.min(x.bottom, y.bottom)
  expect(right).toBeGreaterThan(left)
  expect(bottom).toBeGreaterThan(top)
  const pointerEvents = b.style.pointerEvents
  const childPointerEvents = a.style.pointerEvents
  try {
    b.style.pointerEvents = 'auto'
    a.style.pointerEvents = 'auto'
    expect(a.contains(document.elementFromPoint((left + right) / 2, (top + bottom) / 2))).toBe(true)
  } finally {
    b.style.pointerEvents = pointerEvents
    a.style.pointerEvents = childPointerEvents
  }
  expect(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
}

async function openBoth() {
  await userEvent.click(wrapper!.container.querySelector('[data-open-b]')!)
  await entered('b')
  await userEvent.click(panel('b')!.querySelector('[data-open-a]')!)
  await entered('a')
}

describe.each(Object.keys(components))('%s overlay order', kind => {
  it.each(['before', 'after'] as const)(
    'A mounts %s B but opens above B and remains clickable across reopen',
    async order => {
      const state = await render(kind, order)
      await openBoth()
      for (let cycle = 0; cycle < 2; cycle++) {
        expectAbove()
        expect(state.bOpen.value).toBe(true)
        await userEvent.click(panel('a')!.querySelector('[data-action="a"]')!)
        expect(state.clicks.value).toBe(cycle * 2 + 1)
        await userEvent.keyboard('{Escape}')
        await vi.waitFor(() => expect(panel('a')).toBeNull())
        expect(state.aOpen.value).toBe(false)
        expect(state.bOpen.value).toBe(true)
        await userEvent.click(panel('b')!.querySelector('[data-action="b"]')!)
        expect(state.clicks.value).toBe(cycle * 2 + 2)
        if (cycle === 0) {
          await userEvent.click(panel('b')!.querySelector('[data-open-a]')!)
          await entered('a')
        }
      }
    },
  )
})

it.each(['Sheet', 'Drawer'] as const)(
  '%s places its scrim above the earlier panel and cleans up a custom portal target',
  async kind => {
    const target = document.createElement('div')
    document.body.append(target)
    const state = await render(kind, 'before', target)
    expect(target.children).toHaveLength(0)
    await openBoth()
    expectAbove()
    const a = panel('a')!,
      b = panel('b')!
    const scrims = target.querySelectorAll<HTMLElement>('.hn-scrim')
    expect(scrims).toHaveLength(2)
    const rect = b.getBoundingClientRect()
    const pointerEvents = b.style.pointerEvents
    try {
      a.style.visibility = 'hidden'
      b.style.pointerEvents = 'auto'
      expect(
        document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2),
      ).toBe(scrims[1])
    } finally {
      a.style.visibility = ''
      b.style.pointerEvents = pointerEvents
    }
    state.aOpen.value = false
    await vi.waitFor(() => expect(panel('a')).toBeNull())
    expect(target.querySelectorAll('.hn-scrim')).toHaveLength(1)
    state.bOpen.value = false
    await vi.waitFor(() => expect(panel('b')).toBeNull())
    expect(target.children).toHaveLength(0)
  },
)

it.each(['Sheet', 'Drawer'] as const)(
  '%s retains content and exit animation when reopened before unmount',
  async kind => {
    const state = await render(kind)
    await openBoth()
    const a = panel('a')!
    const input = a.querySelector('input')!
    input.value = 'Retained'
    state.aOpen.value = false
    await vi.waitFor(() => expect(a.dataset.state).toBe('closed'), { interval: 5 })
    const animations = a.getAnimations()
    expect(animations.length).toBeGreaterThan(0)
    animations.forEach(animation => animation.pause())
    expect(a.isConnected).toBe(true)
    expectAbove()
    state.aOpen.value = true
    await tick()
    expect(panel('a')).toBe(a)
    expect(input.value).toBe('Retained')
    await entered('a')
    expectAbove()
    const end = vi.fn()
    a.addEventListener('animationend', end)
    state.aOpen.value = false
    await vi.waitFor(() => expect(panel('a')).toBeNull())
    expect(end).toHaveBeenCalled()
  },
)
