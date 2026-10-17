import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OverlayBranch from './OverlayBranch.vue'
import Drawer from '../drawer/Drawer.vue'
import Popover from '../popover/Popover.vue'
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

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const guide = () => document.getElementById('guide') as HTMLElement

function harness({
  onAction = () => {},
  branchClass = 'fixed top-4 left-4 z-[200]',
  showBranch = true,
}: { onAction?: () => void; branchClass?: string; showBranch?: boolean } = {}) {
  const open = ref(false)
  const branch = ref(showBranch)
  const w = mount(
    defineComponent({
      setup: () => () => [
        h(
          Drawer,
          {
            title: '筛选',
            open: open.value,
            'onUpdate:open': (value?: boolean) => (open.value = !!value),
          },
          { content: () => h('input', { 'aria-label': '抽屉输入' }) },
        ),
        h('p', { id: 'outside' }, '页面正文'),
        h('button', { type: 'button' }, '页面按钮'),
        branch.value
          ? h(OverlayBranch, { id: 'guide', class: branchClass }, () => [
              h(
                'button',
                { type: 'button', class: 'pointer-events-auto', onClick: onAction },
                '引导操作',
              ),
              h('input', { 'aria-label': '引导输入', class: 'pointer-events-auto' }),
            ])
          : null,
      ],
    }),
    { attachTo: attach() },
  )
  mounted.push(w)
  return { open, branch }
}

async function openDrawer(open: { value: boolean }) {
  open.value = true
  await vi.waitFor(() => expect(panel()).toBeTruthy())
  await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe('none'))
}

const settle = () => new Promise(resolve => setTimeout(resolve, 50))

describe('OverlayBranch', () => {
  it('模态抽屉打开时点击分支里的按钮：点击生效，抽屉不关闭', async () => {
    const onAction = vi.fn()
    const { open } = harness({ onAction })
    await openDrawer(open)

    await userEvent.click(page.getByRole('button', { name: '引导操作' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    await settle()
    expect(open.value).toBe(true)
    expect(panel()).toBeTruthy()
  })

  it('分支不被 aria-hidden，页面其余内容被隐藏', async () => {
    const { open } = harness()
    await openDrawer(open)

    expect(guide().closest('[aria-hidden="true"]')).toBeNull()
    expect(document.getElementById('outside')!.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('焦点可以进入分支，输入不被拉回抽屉，抽屉保持打开', async () => {
    const { open } = harness()
    await openDrawer(open)

    const input = page.getByRole('textbox', { name: '引导输入' })
    await userEvent.click(input)
    expect(document.activeElement).toBe(input.element())
    await userEvent.keyboard('ab')
    expect((input.element() as HTMLInputElement).value).toBe('ab')
    await settle()
    expect(document.activeElement).toBe(input.element())
    expect(open.value).toBe(true)
  })

  it('焦点从分支移到页面其他元素时回到抽屉内', async () => {
    const { open } = harness()
    await openDrawer(open)

    await userEvent.click(page.getByRole('textbox', { name: '引导输入' }))
    await userEvent.tab()
    await vi.waitFor(() => expect(panel()!.contains(document.activeElement)).toBe(true))

    await userEvent.click(page.getByRole('button', { name: '引导操作' }))
    expect(document.activeElement).toBe(page.getByRole('button', { name: '引导操作' }).element())
    await userEvent.tab({ shift: true })
    await vi.waitFor(() => expect(panel()!.contains(document.activeElement)).toBe(true))
    expect(open.value).toBe(true)
  })

  it('抽屉打开后才挂载的分支同样可见、可点', async () => {
    const onAction = vi.fn()
    const { open, branch } = harness({ onAction, showBranch: false })
    await openDrawer(open)

    branch.value = true
    await nextTick()
    await vi.waitFor(() => expect(guide()).toBeTruthy())
    await vi.waitFor(() => expect(guide().closest('[aria-hidden="true"]')).toBeNull())
    await userEvent.click(page.getByRole('button', { name: '引导操作' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(open.value).toBe(true)
  })

  it('全屏透明的分支根保持自身的 pointer-events: none，不挡住抽屉', async () => {
    const onAction = vi.fn()
    const { open } = harness({ onAction, branchClass: 'pointer-events-none fixed inset-0 z-[200]' })
    await openDrawer(open)

    expect(getComputedStyle(guide()).pointerEvents).toBe('none')
    const drawerInput = page.getByRole('textbox', { name: '抽屉输入' })
    await userEvent.click(drawerInput)
    expect(document.activeElement).toBe(drawerInput.element())
    await userEvent.click(page.getByRole('button', { name: '引导操作' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(open.value).toBe(true)
  })

  it('抽屉关闭后分支的行内样式恢复原状', async () => {
    const { open } = harness()
    await openDrawer(open)
    expect(guide().style.pointerEvents).toBe('auto')

    open.value = false
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe(''))
    expect(guide().style.pointerEvents).toBe('')
  })

  it('模态 Popover 打开时点击分支不关闭 Popover', async () => {
    const onAction = vi.fn()
    const open = ref(false)
    const w = mount(
      defineComponent({
        setup: () => () => [
          h(
            Popover,
            { open: open.value, 'onUpdate:open': (value?: boolean) => (open.value = !!value) },
            {
              default: () => h(Button, {}, () => '打开'),
              content: () => h('p', '面板'),
            },
          ),
          h(OverlayBranch, { id: 'guide', class: 'fixed top-40 left-4' }, () =>
            h('button', { type: 'button', onClick: onAction }, '引导操作'),
          ),
        ],
      }),
      { attachTo: attach() },
    )
    mounted.push(w)

    await userEvent.click(page.getByRole('button', { name: '打开' }))
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe('none'))
    await userEvent.click(page.getByRole('button', { name: '引导操作' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    await settle()
    expect(open.value).toBe(true)
  })
})
