import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, ref, shallowRef, TransitionGroup } from 'vue'
import AlertDialog from '../components/alert-dialog/AlertDialog.vue'
import Dialog from '../components/dialog/Dialog.vue'
import Button from '../components/button/Button.vue'
import ScrollArea from '../components/scroll-area/ScrollArea.vue'
import '../../test/browser.css'

let wrapper: VueWrapper | undefined
let finishLeave: (() => void) | undefined

beforeEach(async () => {
  await page.viewport(1000, 720)
  finishLeave = undefined
})

afterEach(async () => {
  finishLeave?.()
  wrapper?.unmount()
  await vi.waitFor(() => expect(document.body.style.overflow).toBe(''))
  document.body.innerHTML = ''
})

const cases = (['alert', 'dialog'] as const).flatMap(kind =>
  (['native', 'scroll-area'] as const).map(container => ({ kind, container })),
)

it.each(cases)(
  '$kind / $container 删除项仍在离场时归还焦点不改变滚动位置',
  async ({ kind, container }) => {
    const open = ref(false)
    const rows = ref(Array.from({ length: 100 }, (_, id) => id))
    const area = shallowRef<{ viewport: HTMLElement }>()
    const remove = () => {
      rows.value = rows.value.filter(id => id !== 70)
    }
    const list = () =>
      h(
        TransitionGroup,
        {
          tag: 'div',
          css: false,
          style: 'display:grid;grid-template-columns:repeat(2,1fr);position:relative',
          onBeforeLeave: (element: Element) => {
            const item = element as HTMLElement
            item.style.width = item.offsetWidth + 'px'
            item.style.height = item.offsetHeight + 'px'
            item.style.position = 'absolute'
          },
          onLeave: (_element: Element, done: () => void) => {
            finishLeave = done
          },
        },
        () =>
          rows.value.map(id =>
            h(
              'div',
              {
                key: id,
                'data-item': id,
                style: 'height:48px;display:flex;align-items:center',
              },
              h(Button, { onClick: () => (open.value = true) }, () => '删除 ' + id),
            ),
          ),
      )
    wrapper = mount(
      {
        setup: () => () =>
          h('div', { style: 'width:440px' }, [
            container === 'scroll-area'
              ? h(ScrollArea, { ref: area, class: 'h-80' }, list)
              : h('div', { 'data-viewport': '', style: 'height:320px;overflow:auto' }, [list()]),
            kind === 'alert'
              ? h(AlertDialog, {
                  open: open.value,
                  'onUpdate:open': value => (open.value = !!value),
                  title: '删除条目',
                  description: '确认删除',
                  confirmText: '确认删除',
                  onConfirm: remove,
                })
              : h(
                  Dialog,
                  {
                    open: open.value,
                    'onUpdate:open': value => (open.value = !!value),
                    title: '删除条目',
                  },
                  {
                    footer: () =>
                      h(
                        Button,
                        {
                          onClick: () => {
                            remove()
                            open.value = false
                          },
                        },
                        () => '确认删除',
                      ),
                  },
                ),
          ]),
      },
      {
        attachTo: document.body,
        global: { stubs: { 'transition-group': false } },
      },
    )
    let viewport: HTMLElement
    await vi.waitFor(
      () => {
        viewport =
          container === 'scroll-area'
            ? area.value!.viewport
            : document.querySelector<HTMLElement>('[data-viewport]')!
        expect(viewport?.scrollHeight).toBeGreaterThan(2000)
      },
      { timeout: 5000 },
    )
    viewport!.scrollTop = 1550
    const trigger = document.querySelector<HTMLElement>('[data-item="70"] button')!
    await userEvent.click(trigger)
    const role = kind === 'alert' ? 'alertdialog' : 'dialog'
    await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).not.toBeNull())
    const before = viewport!.scrollTop
    const panel = document.querySelector('[role="' + role + '"]')!
    await userEvent.click(
      Array.from(panel.querySelectorAll('button')).find(
        button => button.textContent?.trim() === '确认删除',
      )!,
    )
    await vi.waitFor(() => expect(rows.value).not.toContain(70))
    expect(trigger.isConnected).toBe(true)
    expect(getComputedStyle(trigger.parentElement!).position).toBe('absolute')
    expect(
      trigger.getBoundingClientRect().top -
        viewport!.getBoundingClientRect().top +
        viewport!.scrollTop,
    ).toBeLessThan(48)
    await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).toBeNull())
    expect(document.activeElement).toBe(trigger)
    expect(viewport!.scrollTop).toBe(before)
    finishLeave!()
    await vi.waitFor(() => expect(trigger.isConnected).toBe(false))
    expect(viewport!.scrollTop).toBe(before)
  },
)

it.each(['alert', 'dialog'] as const)('%s 程序打开后仍归还到插槽触发器', async kind => {
  const open = ref(false)
  wrapper = mount(
    {
      setup: () => () =>
        kind === 'alert'
          ? h(
              AlertDialog,
              {
                open: open.value,
                'onUpdate:open': value => (open.value = !!value),
                title: '确认',
                description: '确认操作',
              },
              () => h(Button, { 'data-trigger': '' }, () => '打开'),
            )
          : h(
              Dialog,
              {
                open: open.value,
                'onUpdate:open': value => (open.value = !!value),
                title: '对话框',
              },
              () => h(Button, { 'data-trigger': '' }, () => '打开'),
            ),
    },
    { attachTo: document.body },
  )
  expect(document.activeElement).toBe(document.body)
  open.value = true
  const role = kind === 'alert' ? 'alertdialog' : 'dialog'
  await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).not.toBeNull())
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(document.querySelector('[role="' + role + '"]')).toBeNull())
  expect(document.activeElement).toBe(document.querySelector('[data-trigger]'))
})
