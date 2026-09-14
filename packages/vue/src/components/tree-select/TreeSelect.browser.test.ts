import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import FormField from '../form-field/FormField.vue'
import TreeSelect from './TreeSelect.vue'
import Input from '../input/Input.vue'
import { zhCN } from '../../locale'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 280px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const items = [
  {
    value: 'jp',
    label: '日本',
    children: [
      { value: 'tokyo', label: '东京', children: [{ value: 'shibuya', label: '涩谷' }] },
      { value: 'osaka', label: '大阪' },
    ],
  },
  { value: 'cn', label: '中国', children: [{ value: 'shanghai', label: '上海' }] },
]

function mountTree(props: Record<string, unknown> = {}) {
  const value = ref<string | number | null | undefined>(props.modelValue as string | undefined)
  const w = mount(TreeSelect, {
    props: {
      items,
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (v?: string | number | null) => {
        value.value = v
        w.setProps({ modelValue: v })
      },
    },
    attrs: { 'aria-label': '地区' },
    attachTo: attach(),
  })
  mounted.push(w)
  return { w, trigger: w.find('[data-hn-tree-select]').element as HTMLButtonElement, value }
}

const tree = () => document.querySelector('[role="tree"]') as HTMLElement | null
const rows = () => Array.from(document.querySelectorAll('[role="treeitem"]')) as HTMLElement[]
const labels = () => rows().map(r => r.textContent?.trim())

describe('tree-select · 展开与选择', () => {
  it('打开只见顶层；点 chevron 只展开不选中；点行选中并关闭；再开时已选路径自动展开', async () => {
    const { trigger, value } = mountTree()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(tree()).toBeTruthy())
    expect(labels()).toEqual(['日本', '中国'])
    const content = document.querySelector('[data-hn-tree-select-content]') as HTMLElement
    await vi.waitFor(() =>
      expect(Math.round(content.getBoundingClientRect().width)).toBe(
        Math.round(trigger.getBoundingClientRect().width),
      ),
    )

    await userEvent.click(rows()[0]!.querySelector('span') as HTMLElement)
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '大阪', '中国']))
    expect(value.value).toBeUndefined()
    expect(tree()).toBeTruthy()

    await userEvent.click(rows()[1]!.querySelector('span') as HTMLElement)
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '涩谷', '大阪', '中国']))
    await userEvent.click(rows()[2]!)
    await vi.waitFor(() => expect(value.value).toBe('shibuya'))
    await vi.waitFor(() => expect(tree()).toBeNull())
    expect(trigger.textContent?.trim()).toBe('涩谷')

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(tree()).toBeTruthy())
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '涩谷', '大阪', '中国']))
    expect(rows()[2]!.getAttribute('aria-selected')).toBe('true')
    expect(rows()[2]!.querySelector('svg')).toBeTruthy()
  })

  it('点父节点的行选中父节点本身，不会顺手展开它', async () => {
    const { trigger, value } = mountTree()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(tree()).toBeTruthy())
    await userEvent.click(rows()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('cn'))
    await vi.waitFor(() => expect(tree()).toBeNull())
  })

  it('键盘：方向键移动焦点，右键展开、左键收起，Enter 选中', async () => {
    const { trigger, value } = mountTree({ defaultExpanded: ['jp'] })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(tree()).toBeTruthy())
    expect(labels()).toEqual(['日本', '东京', '大阪', '中国'])
    await vi.waitFor(() =>
      expect(rows().includes(document.activeElement as HTMLElement)).toBe(true),
    )
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(document.activeElement).toBe(rows()[0]))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(rows()[1]))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '涩谷', '大阪', '中国']))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '大阪', '中国']))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await vi.waitFor(() => expect(value.value).toBe('osaka'))
    await vi.waitFor(() => expect(tree()).toBeNull())
  })
})

describe('tree-select · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { trigger } = mountTree({ size })
      expect(trigger.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })
})

const searchbox = () => document.querySelector('[role="searchbox"]') as HTMLInputElement

describe('tree-select · search', () => {
  it('focuses search, retains matching ancestors and restores expansion without clearing selection', async () => {
    const { trigger, value } = mountTree({ searchable: true, modelValue: 'osaka' })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(document.activeElement).toBe(searchbox()))
    expect(labels()).toEqual(['日本', '东京', '大阪', '中国'])
    await userEvent.fill(searchbox(), '涩谷')
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '涩谷']))
    expect(value.value).toBe('osaka')
    expect(trigger.textContent?.trim()).toBe('大阪')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '东京', '大阪', '中国']))
    expect(searchbox().value).toBe('')
    expect(document.activeElement).toBe(searchbox())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(tree()).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it('moves between input and tree with arrow keys and chooses filtered nodes', async () => {
    const { trigger, value } = mountTree({ searchable: true })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(searchbox()).toBeTruthy())
    await userEvent.fill(searchbox(), '涩谷')
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(rows()[0]))
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(searchbox())
    await userEvent.keyboard('{ArrowUp}')
    await vi.waitFor(() => expect(document.activeElement).toBe(rows()[2]))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(value.value).toBe('shibuya'))
    await vi.waitFor(() => expect(tree()).toBeNull())
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(searchbox()?.value).toBe(''))
    expect(labels()).toEqual(['日本', '东京', '涩谷', '大阪', '中国'])
  })

  it('updates controlled search, handles empty results and clears from the action button', async () => {
    const { w, trigger, value } = mountTree({ searchable: true, searchPlaceholder: '查找节点' })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(searchbox()).toBeTruthy())
    await w.setProps({ search: '不存在' })
    await vi.waitFor(() => expect(labels()).toEqual([]))
    expect(document.querySelector('[role="status"]')?.textContent).toBe('无匹配项')
    expect(searchbox().getAttribute('aria-label')).toBe('查找节点')
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(searchbox())
    const clear = document.querySelector('[aria-label="' + zhCN.common.clear + '"]') as HTMLElement
    expect(clear.getAttribute('type')).toBe('button')
    await userEvent.click(clear)
    await vi.waitFor(() => expect(labels()).toEqual(['日本', '中国']))
    expect(w.emitted('update:search')?.at(-1)).toEqual([''])
    expect(value.value).toBeUndefined()
  })

  it('filters case and accents, updates items and skips disabled matching nodes', async () => {
    const { w, trigger, value } = mountTree({
      searchable: true,
      items: [
        { value: 'a', label: 'Café', disabled: true },
        { value: 'b', label: 'Cafe noir' },
      ],
    })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(searchbox()).toBeTruthy())
    await userEvent.fill(searchbox(), ' CAFE ')
    await vi.waitFor(() => expect(labels()).toEqual(['Café', 'Cafe noir']))
    await w.setProps({
      items: [
        { value: 'a', label: 'Café', disabled: true },
        { value: 'c', label: 'Cafe blanc' },
      ],
    })
    await vi.waitFor(() => expect(labels()).toEqual(['Café', 'Cafe blanc']))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(rows()[1]))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(value.value).toBe('c'))
  })

  it('keeps the outer FormField label and description associated with the trigger', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(
            FormField,
            { label: '地区', description: '选择一个节点' },
            {
              default: () => h(TreeSelect, { items, searchable: true }),
            },
          ),
      }),
      { attachTo: attach() },
    )
    mounted.push(w)
    const trigger = w.find('[data-hn-tree-select]').element as HTMLElement
    const id = trigger.id
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(searchbox()).toBeTruthy())
    expect(w.find('label').attributes('for')).toBe(id)
    expect(searchbox().id).not.toBe(id)
    expect(searchbox().hasAttribute('aria-describedby')).toBe(false)
    expect(tree()?.getAttribute('aria-labelledby')).toBe(w.find('label').attributes('id'))
    expect(searchbox().getAttribute('aria-controls')).toBe(tree()?.id)
    expect(document.querySelectorAll('[id="' + id + '"]')).toHaveLength(1)
  })
})
