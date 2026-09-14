import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef, type Component } from 'vue'
import { ConfigProvider } from 'reka-ui'
import Sheet from '../components/sheet/Sheet.vue'
import Drawer from '../components/drawer/Drawer.vue'
import Dialog from '../components/dialog/Dialog.vue'
import AlertDialog from '../components/alert-dialog/AlertDialog.vue'
import Popover from '../components/popover/Popover.vue'
import DropdownMenu from '../components/dropdown-menu/DropdownMenu.vue'
import '../../test/browser.css'

let wrapper: VueWrapper | undefined
beforeEach(async () => {
  await page.viewport(1000, 800)
  document.body.innerHTML = ''
})
afterEach(async () => {
  wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => {
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })
  document.body.innerHTML = ''
})

const components: Record<string, Component> = {
  Sheet,
  Drawer,
  DropdownMenu,
  Dialog,
  AlertDialog,
  Popover,
}
const panel = (name: string) => document.querySelector<HTMLElement>('.order-' + name)

function render(kind: string, order: 'before' | 'after' = 'before', teleportTo?: HTMLElement) {
  const aOpen = ref(false),
    bOpen = ref(false)
  const anchor = shallowRef<HTMLElement | null>(null)
  const clicks = ref(0)
  const body = (name: 'a' | 'b') =>
    h('div', { style: 'width:280px;height:200px;display:grid;gap:12px' }, [
      ...(name === 'b'
        ? [
            h(
              'button',
              {
                ref: anchor,
                'data-open-a': '',
                onClick: () => {
                  aOpen.value = true
                },
                style: 'height:32px;width:160px',
              },
              'Open A',
            ),
          ]
        : [h('input', { 'aria-label': 'A input', style: 'height:32px;width:160px' })]),
      h(
        'button',
        {
          'data-action': name,
          onClick: () => {
            clicks.value++
          },
          style: 'height:32px;width:160px',
        },
        'Action ' + name,
      ),
    ])
  const overlay = (name: 'a' | 'b') =>
    h(
      components[kind]!,
      {
        title: name.toUpperCase(),
        label: name.toUpperCase(),
        description: 'Overlay order',
        class: 'order-' + name,
        open: name === 'a' ? aOpen.value : bOpen.value,
        'onUpdate:open': (value: boolean) => {
          ;(name === 'a' ? aOpen : bOpen).value = value
        },
        ...(kind === 'DropdownMenu' || kind === 'Popover'
          ? { anchor: name === 'a' ? anchor.value : undefined, sideOffset: -16, align: 'start' }
          : {}),
      },
      {
        ...(name === 'b'
          ? {
              default: () =>
                h(
                  'button',
                  {
                    'data-open-b': '',
                    style: 'position:fixed;left:280px;top:160px;width:160px;height:32px',
                  },
                  'Open B',
                ),
            }
          : {}),
        content: () => body(name),
      },
    )
  const DeepB = defineComponent({ setup: () => () => h('div', h('div', overlay('b'))) })
  wrapper = mount(
    {
      setup: () => () =>
        h(ConfigProvider, { teleportTo }, () =>
          h('div', order === 'before' ? [overlay('a'), h(DeepB)] : [h(DeepB), overlay('a')]),
        ),
    },
    { attachTo: document.body },
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
  await userEvent.click(wrapper!.get('[data-open-b]').element)
  await entered('b')
  await userEvent.click(panel('b')!.querySelector('[data-open-a]')!)
  await entered('a')
}

describe.each(Object.keys(components))('%s overlay order', kind => {
  it.each(['before', 'after'] as const)(
    'A mounts %s B but opens above B and remains clickable across reopen',
    async order => {
      const state = render(kind, order)
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
    const state = render(kind, 'before', target)
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
    const state = render(kind)
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
    await nextTick()
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
