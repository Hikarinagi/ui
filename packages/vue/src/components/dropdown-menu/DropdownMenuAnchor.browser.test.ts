import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, shallowRef } from 'vue'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuSub from './DropdownMenuSub.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

function button(left = 140, top = 100) {
  const el = document.createElement('button')
  el.style.cssText = `position:fixed;left:${left}px;top:${top}px;width:80px;height:30px`
  el.textContent = '外部触发器'
  document.body.appendChild(el)
  return el
}

function harness(extra: Record<string, unknown> = {}, initiallyMissing = false) {
  const anchor = shallowRef<HTMLElement | null>(initiallyMissing ? null : button())
  const open = ref(false)
  const select = vi.fn()
  const wrapper = mount(
    {
      setup: () => () =>
        h(
          DropdownMenu,
          {
            anchor: anchor.value,
            open: open.value,
            label: '外部菜单',
            align: 'start',
            'onUpdate:open': (value: boolean | undefined) => {
              open.value = !!value
            },
            ...extra,
          },
          {
            content: () => [
              h(DropdownMenuItem, { onSelect: select }, () => '复制'),
              h(DropdownMenuItem, { disabled: true }, () => '禁用项'),
              h(DropdownMenuSub, { label: '导出' }, () => h(DropdownMenuItem, () => 'PDF')),
            ],
          },
        ),
    },
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  if (anchor.value)
    anchor.value.onclick = () => {
      open.value = !open.value
    }
  return { anchor, open, select, wrapper }
}

const menu = () => document.querySelector('[role="menu"]') as HTMLElement | null
const position = () => menu()!.parentElement!.getBoundingClientRect()

describe('DropdownMenu 外部锚点', () => {
  it('锚点可延迟提供与更换，无额外 Trigger，属性到达菜单面板', async () => {
    const { anchor, open, wrapper } = harness({ 'data-custom': 'menu' }, true)
    open.value = true
    await nextTick()
    expect(menu()).toBeNull()
    anchor.value = button()
    await vi.waitFor(() => {
      expect(position().left).toBeCloseTo(140, 0)
      expect(position().top).toBeCloseTo(138, 0)
    })
    expect(menu()!.getAttribute('aria-label')).toBe('外部菜单')
    expect(menu()!.getAttribute('data-custom')).toBe('menu')
    expect(wrapper.findAll('button')).toHaveLength(0)
    anchor.value = button(240, 220)
    await vi.waitFor(() => expect(position().top).toBeCloseTo(258, 0))
  })

  it.each([true, false])('modal=%s 选中条目后关闭并恢复打开前的焦点', async modal => {
    const closing = vi.fn()
    const { anchor, open, select } = harness({ modal, onCloseAutoFocus: closing })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()).not.toBeNull())
    await userEvent.click(document.querySelector('[role="menuitem"]') as HTMLElement)
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(open.value).toBe(false)
    expect(select).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(anchor.value)
    expect(closing).toHaveBeenCalledOnce()
  })

  it('键盘打开后选中首项，跳过禁用项，子菜单和 Esc 行为保留', async () => {
    const { anchor, open } = harness()
    anchor.value!.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        open.value = true
      }
    }
    anchor.value!.focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('复制'))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('导出'))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]')).toHaveLength(2))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]')).toHaveLength(1))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(document.activeElement).toBe(anchor.value)
  })

  it('非模态重复点击外部锚点可关闭，外部点击不会抢回焦点', async () => {
    const { anchor, open } = harness({ modal: false })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()).not.toBeNull())
    expect(document.body.style.overflow).not.toBe('hidden')
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(open.value).toBe(false)
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()).not.toBeNull())
    const outside = button(300, 40)
    outside.textContent = '外部按钮'
    await userEvent.click(outside)
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(document.activeElement).toBe(outside)
  })

  it('外部交互与 Esc 可以取消，关闭聚焦可交给调用方', async () => {
    let cancelled = true
    const editor = document.createElement('textarea')
    document.body.appendChild(editor)
    const closing = vi.fn((event: Event) => {
      event.preventDefault()
      editor.focus()
    })
    const { anchor, open } = harness({
      modal: false,
      onInteractOutside: (event: Event) => {
        if (cancelled) event.preventDefault()
      },
      onEscapeKeyDown: (event: KeyboardEvent) => {
        if (cancelled) event.preventDefault()
      },
      onCloseAutoFocus: closing,
    })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    expect(open.value).toBe(true)
    await userEvent.click(button(300, 40))
    expect(open.value).toBe(true)
    cancelled = false
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(closing).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(editor)
  })

  it('关闭时清空锚点保持退场位置，新一轮无锚点时等待', async () => {
    const { anchor, open } = harness()
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()).not.toBeNull())
    const before = position()
    open.value = false
    anchor.value = null
    await nextTick()
    expect(menu()!.getAttribute('data-state')).toBe('closed')
    expect(getComputedStyle(menu()!).animationName).toBe('hn-pop-out')
    expect(position().left).toBeCloseTo(before.left, 0)
    expect(position().top).toBeCloseTo(before.top, 0)
    await vi.waitFor(() => expect(menu()).toBeNull())
    open.value = true
    await nextTick()
    expect(menu()).toBeNull()
  })

  it('RTL 方向仍传给菜单根节点，向左键打开子菜单', async () => {
    const { anchor } = harness({ dir: 'rtl' })
    await userEvent.click(anchor.value!)
    await vi.waitFor(() => expect(menu()!.getAttribute('dir')).toBe('rtl'))
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowLeft}')
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]')).toHaveLength(2))
  })
})
