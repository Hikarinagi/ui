import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import ContextMenu from './ContextMenu.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuSeparator from './ContextMenuSeparator.vue'
import ContextMenuCheckboxItem from './ContextMenuCheckboxItem.vue'
import ContextMenuSub from './ContextMenuSub.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(props: Record<string, unknown> = {}, onSelect = vi.fn()) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const checked = ref(false)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'padding: 160px' }, [
          h(
            ContextMenu,
            { label: '文件操作', ...props },
            {
              default: () =>
                h('div', { 'data-area': '', style: 'width: 240px; height: 120px' }, '右键区域'),
              content: () => [
                h(ContextMenuItem, { onSelect }, () => '复制'),
                h(ContextMenuSeparator),
                h(
                  ContextMenuCheckboxItem,
                  {
                    checked: checked.value,
                    'onUpdate:checked': (value: boolean) => (checked.value = value),
                  },
                  () => '置顶',
                ),
                h(ContextMenuSub, { label: '移动到' }, () => [
                  h(ContextMenuItem, () => '收藏夹'),
                  h(ContextMenuItem, () => '归档'),
                ]),
                h(ContextMenuItem, { tone: 'danger' }, () => '删除'),
              ],
            },
          ),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return { w, onSelect, checked }
}

const area = () => document.querySelector('[data-area]') as HTMLElement
const menu = () => document.querySelector('[role="menu"]') as HTMLElement | null
const items = () => [...document.querySelectorAll('[role="menuitem"]')] as HTMLElement[]

describe('ContextMenu', () => {
  it('右键打开菜单，出现在指针处，条目是 menuitem，锁滚', async () => {
    harness()
    expect(menu()).toBeNull()
    await userEvent.click(area(), { button: 'right', position: { x: 40, y: 30 } })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    const box = menu()!.getBoundingClientRect()
    const anchor = area().getBoundingClientRect()
    expect(box.left).toBeGreaterThanOrEqual(anchor.left + 30)
    expect(box.top).toBeGreaterThanOrEqual(anchor.top + 20)
    expect(menu()!.getAttribute('aria-label')).toBe('文件操作')
    expect(menu()!.className).toContain('hn-anim-pop')
    expect(items().map(el => el.textContent?.trim())).toEqual(['复制', '移动到', '删除'])
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('点条目发 select 并关闭；Esc 关闭', async () => {
    const { onSelect } = harness()
    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.click(items()[0]!)
    expect(onSelect).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(menu()).toBeNull())

    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu()).toBeNull())
  })

  it('多选项切换后菜单保持打开', async () => {
    const { checked } = harness()
    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    const box = document.querySelector('[role="menuitemcheckbox"]') as HTMLElement
    await userEvent.click(box)
    await vi.waitFor(() => expect(checked.value).toBe(true))
    expect(menu()).toBeTruthy()
    expect(box.getAttribute('aria-checked')).toBe('true')
  })

  it('子菜单经悬停展开', async () => {
    harness()
    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.hover(items()[1]!)
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]').length).toBe(2))
    const names = [...document.querySelectorAll('[role="menuitem"]')].map(el =>
      el.textContent?.trim(),
    )
    expect(names).toContain('收藏夹')
  })

  it('disabled 时右键不打开', async () => {
    harness({ disabled: true })
    await userEvent.click(area(), { button: 'right' })
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(menu()).toBeNull()
  })
})
