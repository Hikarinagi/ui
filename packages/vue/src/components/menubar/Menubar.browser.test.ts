import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import Menubar from './Menubar.vue'
import MenubarMenu from './MenubarMenu.vue'
import MenubarItem from './MenubarItem.vue'
import MenubarSeparator from './MenubarSeparator.vue'
import MenubarCheckboxItem from './MenubarCheckboxItem.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(onSelect = vi.fn()) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const value = ref<string | undefined>()
  const grid = ref(false)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'padding: 120px' }, [
          h(
            Menubar,
            {
              label: '应用菜单',
              modelValue: value.value,
              'onUpdate:modelValue': (next: string | undefined) => (value.value = next),
            },
            () => [
              h(MenubarMenu, { label: '文件', value: 'file' }, () => [
                h(MenubarItem, { onSelect }, () => '新建'),
                h(MenubarSeparator),
                h(MenubarItem, { tone: 'danger' }, () => '删除'),
              ]),
              h(MenubarMenu, { label: '视图', value: 'view' }, () => [
                h(
                  MenubarCheckboxItem,
                  {
                    checked: grid.value,
                    'onUpdate:checked': (next: boolean) => (grid.value = next),
                  },
                  () => '显示网格',
                ),
              ]),
              h(MenubarMenu, { label: '帮助', value: 'help', disabled: true }, () => [
                h(MenubarItem, () => '关于'),
              ]),
            ],
          ),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return { w, onSelect, value, grid }
}

const bar = () => document.querySelector('[role="menubar"]') as HTMLElement
const triggers = () => [...bar().querySelectorAll('button')] as HTMLButtonElement[]
const menu = () => document.querySelector('[role="menu"]') as HTMLElement | null
const items = () => [...document.querySelectorAll('[role="menuitem"]')] as HTMLElement[]

describe('Menubar', () => {
  it('根是 menubar，触发器带 aria-haspopup；点开后是 role=menu，值写回', async () => {
    const { value } = harness()
    expect(bar().getAttribute('aria-label')).toBe('应用菜单')
    expect(triggers()).toHaveLength(3)
    expect(triggers()[0]!.getAttribute('aria-haspopup')).toBe('menu')

    await userEvent.click(triggers()[0]!)
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    expect(menu()!.className).toContain('hn-anim-pop')
    expect(items().map(el => el.textContent?.trim())).toContain('新建')
    expect(triggers()[0]!.getAttribute('data-state')).toBe('open')
    expect(value.value).toBe('file')
  })

  it('打开后悬停另一个触发器即切换菜单；方向键也能切换', async () => {
    const { value } = harness()
    await userEvent.click(triggers()[0]!)
    await vi.waitFor(() => expect(value.value).toBe('file'))

    await userEvent.hover(triggers()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('view'))
    await vi.waitFor(() => expect(document.querySelector('[role="menuitemcheckbox"]')).toBeTruthy())

    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(value.value).toBe('file'))
  })

  it('往回悬停到刚关闭的菜单时仍然切换，不会整栏收起', async () => {
    const { value } = harness()
    await userEvent.click(triggers()[0]!)
    await vi.waitFor(() => expect(value.value).toBe('file'))
    await userEvent.hover(triggers()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('view'))
    await userEvent.hover(triggers()[0]!)
    await vi.waitFor(() => expect(value.value).toBe('file'))
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(value.value).toBe('file')
    expect(menu()).toBeTruthy()
    await userEvent.hover(triggers()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('view'))
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(value.value).toBe('view')
  })

  it('选中条目触发 select 并关闭；Esc 关闭并把焦点还给触发器', async () => {
    const { onSelect, value } = harness()
    await userEvent.click(triggers()[0]!)
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.click(items().find(el => el.textContent?.trim() === '新建')!)
    expect(onSelect).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(value.value).toBe('')

    await userEvent.click(triggers()[0]!)
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(document.activeElement).toBe(triggers()[0])
  })

  it('多选项切换后菜单保持打开；禁用的菜单打不开', async () => {
    const { grid } = harness()
    await userEvent.click(triggers()[1]!)
    const box = await vi.waitFor(() => {
      const el = document.querySelector('[role="menuitemcheckbox"]') as HTMLElement | null
      expect(el).toBeTruthy()
      return el!
    })
    await userEvent.click(box)
    await vi.waitFor(() => expect(grid.value).toBe(true))
    expect(document.querySelector('[role="menu"]')).toBeTruthy()

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu()).toBeNull())
    expect(triggers()[2]!.disabled).toBe(true)
    await userEvent.click(triggers()[2]!, { force: true })
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(menu()).toBeNull()
  })
})
